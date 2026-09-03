-- Public field-validation read model for bizzisystems.com.
--
-- This migration is strictly additive and belongs to the marketing site, not
-- the pilot platform. It does not alter sensors, occupancy_events, telemetry
-- ingestion, pilot tables, existing RLS policies, or any grant that the pilot
-- dashboard depends on.
--
-- The public website never queries pilot tables. It calls one SECURITY DEFINER
-- function, public.public_field_snapshot(), which returns a fixed sanitized
-- JSON document. Two allowlist tables control what that function is allowed to
-- describe: nothing is public until a row is added here by an admin.
--
-- Every statement here is idempotent (CREATE IF NOT EXISTS, CREATE OR REPLACE,
-- INSERT ... ON CONFLICT DO NOTHING), so the whole file can be re-run against a
-- database that already has it. Re-running does not reset is_published.
--
-- Deliberately absent from every code path below: device_eui, sensor UUIDs,
-- stall_id, display_name, street address, coordinates, gateway or receiver
-- identifiers, runtime, magnetic delta, raw payloads, check-in author
-- identity, discrepancy notes, incident details, profile rows.
--
-- Battery voltage and RSSI ARE returned: management approved showing the same
-- hardware-health readings the operator sensor cards show, minus runtime.
--
-- The pilot's own name is withheld too. The function returns
-- public_field_sites.public_name, which an admin sets, and never
-- pilots.name, pilots.location_name or pilots.address.

-- ---------------------------------------------------------------------------
-- Allowlists
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.public_field_sites (
  pilot_id uuid PRIMARY KEY REFERENCES public.pilots(id) ON DELETE CASCADE,
  is_published boolean NOT NULL DEFAULT false,
  public_name text NOT NULL,
  public_city text NOT NULL,
  window_days integer NOT NULL DEFAULT 7 CHECK (window_days BETWEEN 1 AND 90),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (length(trim(public_name)) > 0),
  CHECK (length(trim(public_city)) > 0)
);

COMMENT ON TABLE public.public_field_sites IS
  'Opt-in allowlist. A pilot appears on the public website only while is_published is true.';

-- One published site at a time keeps the public snapshot unambiguous.
CREATE UNIQUE INDEX IF NOT EXISTS public_field_sites_single_published_idx
  ON public.public_field_sites ((true)) WHERE is_published;

CREATE TABLE IF NOT EXISTS public.public_field_spaces (
  sensor_id uuid PRIMARY KEY REFERENCES public.sensors(id) ON DELETE CASCADE,
  pilot_id uuid NOT NULL REFERENCES public.pilots(id) ON DELETE CASCADE,
  public_label text NOT NULL,
  public_kind text NOT NULL CHECK (public_kind IN ('Regular', 'Pickup', 'ADA')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (length(trim(public_label)) > 0)
);

COMMENT ON COLUMN public.public_field_spaces.public_label IS
  'Display name shown on the public site. Never the stall_id or display_name.';

CREATE UNIQUE INDEX IF NOT EXISTS public_field_spaces_label_idx
  ON public.public_field_spaces (pilot_id, lower(public_label));

ALTER TABLE public.public_field_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_field_spaces ENABLE ROW LEVEL SECURITY;

-- No policies are created, so RLS denies everything by default. The tables are
-- reachable only through the SECURITY DEFINER function and the service role.
REVOKE ALL ON public.public_field_sites FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.public_field_spaces FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.public_field_sites TO service_role;
GRANT ALL ON public.public_field_spaces TO service_role;

-- ---------------------------------------------------------------------------
-- Snapshot function
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.public_field_snapshot()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_site        public.public_field_sites%ROWTYPE;
  v_pilot       public.pilots%ROWTYPE;
  v_window_start timestamptz;
  v_window_end   timestamptz := now();
  v_result      jsonb;
BEGIN
  SELECT * INTO v_site
  FROM public.public_field_sites
  WHERE is_published
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('published', false);
  END IF;

  SELECT * INTO v_pilot FROM public.pilots WHERE id = v_site.pilot_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('published', false);
  END IF;

  v_window_start := greatest(
    v_window_end - (v_site.window_days || ' days')::interval,
    coalesce(v_pilot.start_at, v_window_end - (v_site.window_days || ' days')::interval)
  );

  WITH spaces AS (
    SELECT
      s.sensor_id,
      s.public_label,
      s.public_kind,
      s.sort_order,
      sn.is_online,
      sn.last_seen_at,
      sn.battery_voltage,
      sn.battery_flag,
      sn.signal_strength
    FROM public.public_field_spaces s
    JOIN public.sensors sn ON sn.id = s.sensor_id
    WHERE s.pilot_id = v_site.pilot_id
      AND sn.is_active
  ),
  seed AS (
    -- State carried into the window from the last event before it starts.
    SELECT DISTINCT ON (oe.sensor_id)
      oe.sensor_id,
      oe.occupancy_state,
      v_window_start AS event_timestamp
    FROM public.occupancy_events oe
    JOIN spaces sp ON sp.sensor_id = oe.sensor_id
    WHERE oe.event_timestamp < v_window_start
    ORDER BY oe.sensor_id, oe.event_timestamp DESC, oe.id DESC
  ),
  in_window AS (
    SELECT oe.sensor_id, oe.occupancy_state, oe.event_timestamp
    FROM public.occupancy_events oe
    JOIN spaces sp ON sp.sensor_id = oe.sensor_id
    WHERE oe.event_timestamp >= v_window_start
      AND oe.event_timestamp <= v_window_end
  ),
  events AS (
    SELECT * FROM seed
    UNION ALL
    SELECT * FROM in_window
  ),
  spans AS (
    SELECT
      sensor_id,
      occupancy_state,
      event_timestamp AS span_start,
      lead(event_timestamp) OVER (
        PARTITION BY sensor_id ORDER BY event_timestamp
      ) AS next_start
    FROM events
  ),
  spans_closed AS (
    SELECT
      sensor_id,
      occupancy_state,
      span_start,
      coalesce(next_start, v_window_end) AS span_end,
      next_start IS NOT NULL AS is_complete
    FROM spans
    WHERE coalesce(next_start, v_window_end) > span_start
  ),
  per_space AS (
    SELECT
      sensor_id,
      sum(extract(epoch FROM (span_end - span_start))) AS observed_seconds,
      sum(extract(epoch FROM (span_end - span_start)))
        FILTER (WHERE occupancy_state = 'OCCUPIED') AS occupied_seconds,
      count(*) FILTER (
        WHERE occupancy_state = 'OCCUPIED' AND is_complete
      ) AS completed_sessions,
      -- Mean, matching the pilot report's definition of average dwell so the
      -- website and a printed report never disagree about the same site.
      avg(extract(epoch FROM (span_end - span_start)) / 60.0)
        FILTER (WHERE occupancy_state = 'OCCUPIED' AND is_complete)
        AS mean_dwell_minutes,
      -- Vacancy duration: the gap between one car leaving and the next arriving.
      avg(extract(epoch FROM (span_end - span_start)) / 60.0)
        FILTER (WHERE occupancy_state = 'VACANT' AND is_complete)
        AS mean_vacancy_minutes
    FROM spans_closed
    GROUP BY sensor_id
  ),
  -- Every transition in the window, for the events table and the sparkline.
  space_events AS (
    SELECT
      oe.sensor_id,
      oe.occupancy_state,
      oe.event_timestamp
    FROM public.occupancy_events oe
    JOIN spaces sp ON sp.sensor_id = oe.sensor_id
    WHERE oe.event_timestamp >= v_window_start
  ),
  event_counts AS (
    SELECT sensor_id, count(*) AS total_events, max(event_timestamp) AS last_event_at
    FROM space_events
    GROUP BY sensor_id
  ),
  -- Twenty-four one-hour buckets ending now, matching the dashboard sparkline.
  sparkline AS (
    SELECT
      sp.sensor_id,
      b.bucket,
      count(se.event_timestamp) AS events
    FROM spaces sp
    CROSS JOIN generate_series(0, 23) AS b(bucket)
    LEFT JOIN space_events se
      ON se.sensor_id = sp.sensor_id
     AND se.event_timestamp >= v_window_end - ((24 - b.bucket) * interval '1 hour')
     AND se.event_timestamp <  v_window_end - ((23 - b.bucket) * interval '1 hour')
    GROUP BY sp.sensor_id, b.bucket
  ),
  latest AS (
    SELECT DISTINCT ON (oe.sensor_id)
      oe.sensor_id,
      oe.occupancy_state,
      oe.event_timestamp
    FROM public.occupancy_events oe
    JOIN spaces sp ON sp.sensor_id = oe.sensor_id
    ORDER BY oe.sensor_id, oe.event_timestamp DESC, oe.id DESC
  ),
  hour_slots AS (
    SELECT generate_series(
      date_trunc('hour', v_window_start),
      date_trunc('hour', v_window_end),
      interval '1 hour'
    ) AS slot_start
  ),
  hour_overlap AS (
    SELECT
      sc.sensor_id,
      extract(
        hour FROM (h.slot_start AT TIME ZONE v_pilot.time_zone)
      )::int AS hour_of_day,
      sc.occupancy_state,
      extract(epoch FROM (
        least(sc.span_end, h.slot_start + interval '1 hour')
        - greatest(sc.span_start, h.slot_start)
      )) AS seconds
    FROM spans_closed sc
    JOIN hour_slots h
      ON sc.span_start < h.slot_start + interval '1 hour'
     AND sc.span_end > h.slot_start
  ),
  hourly AS (
    SELECT
      sensor_id,
      hour_of_day,
      sum(seconds) AS total_seconds,
      sum(seconds) FILTER (WHERE occupancy_state = 'OCCUPIED') AS occupied_seconds
    FROM hour_overlap
    GROUP BY sensor_id, hour_of_day
  ),
  accuracy AS (
    SELECT
      count(DISTINCT ci.id) AS check_ins,
      count(o.id) AS validated_observations,
      count(o.id) FILTER (WHERE o.is_match) AS matches,
      count(o.id) FILTER (WHERE NOT o.is_match) AS mismatches
    FROM public.pilot_check_ins ci
    JOIN public.pilot_check_in_observations o ON o.check_in_id = ci.id
    WHERE ci.pilot_id = v_site.pilot_id
  ),
  totals AS (
    SELECT
      count(*) AS event_count,
      max(oe.event_timestamp) AS last_event_at
    FROM public.occupancy_events oe
    JOIN spaces sp ON sp.sensor_id = oe.sensor_id
    WHERE oe.event_timestamp >= v_window_start
  )
  SELECT jsonb_build_object(
    'published', true,
    'generated_at', v_window_end,
    'window_start', v_window_start,
    'window_days', v_site.window_days,
    'site', jsonb_build_object(
      'name', v_site.public_name,
      'city', v_site.public_city,
      'started_at', v_pilot.start_at,
      'expected_end_at', v_pilot.expected_end_at,
      'status', v_pilot.status,
      'time_zone', v_pilot.time_zone,
      'days_elapsed', CASE
        WHEN v_pilot.start_at IS NULL THEN NULL
        ELSE greatest(0, floor(extract(epoch FROM (v_window_end - v_pilot.start_at)) / 86400)::int)
      END,
      'scheduled_days', CASE
        WHEN v_pilot.start_at IS NULL OR v_pilot.expected_end_at IS NULL THEN NULL
        ELSE greatest(
          0,
          ceil(extract(epoch FROM (v_pilot.expected_end_at - v_pilot.start_at)) / 86400)::int
        )
      END
    ),
    'spaces_monitored', (SELECT count(*) FROM spaces),
    'spaces_online', (SELECT count(*) FROM spaces WHERE is_online),
    'spaces_offline', (SELECT count(*) FROM spaces WHERE NOT is_online),
    'occupancy_events', (SELECT event_count FROM totals),
    'last_event_at', (SELECT last_event_at FROM totals),
    'accuracy', (
      SELECT jsonb_build_object(
        'check_ins', check_ins,
        'validated_observations', validated_observations,
        'matches', matches,
        'mismatches', mismatches
      ) FROM accuracy
    ),
    'spaces', coalesce((
      SELECT jsonb_agg(space ORDER BY space->>'sort_order')
      FROM (
        SELECT jsonb_build_object(
          'label', sp.public_label,
          'kind', sp.public_kind,
          'sort_order', lpad(sp.sort_order::text, 4, '0'),
          'online', sp.is_online,
          'state', coalesce(l.occupancy_state, 'UNKNOWN'),
          'state_since', l.event_timestamp,
          'occupancy_rate', CASE
            WHEN coalesce(ps.observed_seconds, 0) > 0
            THEN round((coalesce(ps.occupied_seconds, 0) / ps.observed_seconds)::numeric, 4)
            ELSE NULL
          END,
          'observed_minutes', round((coalesce(ps.observed_seconds, 0) / 60.0)::numeric, 0),
          'completed_sessions', coalesce(ps.completed_sessions, 0),
          'mean_dwell_minutes', round(ps.mean_dwell_minutes::numeric, 0),
          'mean_vacancy_minutes', round(ps.mean_vacancy_minutes::numeric, 0),
          'turnover_per_day', CASE
            WHEN coalesce(ps.observed_seconds, 0) > 0
            THEN round(
              (coalesce(ps.completed_sessions, 0) / (ps.observed_seconds / 86400.0))::numeric, 2
            )
            ELSE NULL
          END,
          'total_events', coalesce(ec.total_events, 0),
          'last_event_at', ec.last_event_at,
          -- Hardware health, as shown on the operator sensor cards. Runtime is
          -- deliberately excluded.
          'battery_volts', sp.battery_voltage,
          'battery_flag', sp.battery_flag,
          'signal_dbm', sp.signal_strength,
          'events_24h', coalesce((
            SELECT jsonb_agg(sl.events ORDER BY sl.bucket)
            FROM sparkline sl WHERE sl.sensor_id = sp.sensor_id
          ), '[]'::jsonb),
          'recent_events', coalesce((
            SELECT jsonb_agg(entry ORDER BY entry->>'at' DESC)
            FROM (
              SELECT jsonb_build_object('at', se.event_timestamp, 'state', se.occupancy_state) AS entry
              FROM space_events se
              WHERE se.sensor_id = sp.sensor_id
              ORDER BY se.event_timestamp DESC
              LIMIT 12
            ) recent
          ), '[]'::jsonb),
          'hours', coalesce((
            SELECT jsonb_agg(jsonb_build_object(
              'hour', hh.hour_of_day,
              'occupancy_rate', CASE
                WHEN hh.total_seconds > 0
                THEN round((coalesce(hh.occupied_seconds, 0) / hh.total_seconds)::numeric, 4)
                ELSE NULL
              END,
              'sample_minutes', round((hh.total_seconds / 60.0)::numeric, 0)
            ) ORDER BY hh.hour_of_day)
            FROM hourly hh WHERE hh.sensor_id = sp.sensor_id
          ), '[]'::jsonb)
        ) AS space
        FROM spaces sp
        LEFT JOIN per_space ps ON ps.sensor_id = sp.sensor_id
        LEFT JOIN latest l ON l.sensor_id = sp.sensor_id
        LEFT JOIN event_counts ec ON ec.sensor_id = sp.sensor_id
      ) rows
    ), '[]'::jsonb)
  )
  INTO v_result;

  RETURN v_result;
END;
$$;

COMMENT ON FUNCTION public.public_field_snapshot() IS
  'Sanitized read-only field snapshot for the public website. Returns aggregate occupancy and validation counts only; exposes no hardware, location, or user identifiers.';

REVOKE ALL ON FUNCTION public.public_field_snapshot() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_field_snapshot() TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Initial allowlist rows
-- ---------------------------------------------------------------------------
-- The Austin pilot, seeded with an anonymous public name. Spaces are matched
-- on stall_id, which stays server-side; the website only ever sees public_label.
-- is_published starts false. Flip it once management approves going live.

-- public_name is what the website prints. It is seeded anonymously on purpose:
-- the host of a field site is theirs to disclose, not ours. Naming a host is a
-- deliberate one-row UPDATE, never a code change.
INSERT INTO public.public_field_sites (pilot_id, is_published, public_name, public_city, window_days)
SELECT p.id, false, 'Austin field site', 'Austin, Texas', 7
FROM public.pilots p
WHERE p.id = '00000000-0000-4000-8000-000000000001'
ON CONFLICT (pilot_id) DO NOTHING;

INSERT INTO public.public_field_spaces (sensor_id, pilot_id, public_label, public_kind, sort_order)
SELECT
  s.id,
  '00000000-0000-4000-8000-000000000001'::uuid,
  v.public_label,
  v.public_kind,
  v.sort_order
FROM (VALUES
  ('R1',   'Space 1', 'Regular', 1),
  ('P1',   'Space 2', 'Pickup',  2),
  ('ADA1', 'Space 3', 'ADA',     3)
) AS v(stall_id, public_label, public_kind, sort_order)
JOIN public.sensors s ON upper(s.stall_id) = upper(v.stall_id)
ON CONFLICT (sensor_id) DO NOTHING;

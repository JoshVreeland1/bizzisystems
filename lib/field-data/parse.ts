import type {
  FieldAccuracy,
  FieldSnapshot,
  FieldSpace,
  HistoryPoint,
  SpaceEvent,
  SpaceKind,
  SpaceState,
} from './types'

/**
 * Battery and signal percentages use exactly the same mapping as the operator
 * dashboard, so a number on this site and the same number on the pilot
 * platform never disagree.
 */
const BATTERY_EMPTY_VOLTS = 3.5
const BATTERY_FULL_VOLTS = 4.2
const RSSI_EMPTY_DBM = -90
const RSSI_FULL_DBM = -50

/** A real reading sits in roughly 2.0–5.0V. Anything else is a bad frame. */
export function plausibleVolts(volts: number | null): number | null {
  return volts !== null && volts >= 2 && volts <= 5 ? volts : null
}

/** LoRa RSSI lives in roughly -140–0 dBm. Anything else is a bad frame. */
export function plausibleDbm(dbm: number | null): number | null {
  return dbm !== null && dbm >= -140 && dbm <= 0 ? Math.round(dbm) : null
}

export function batteryPercent(volts: number | null): number | null {
  if (volts === null) return null
  const ratio = (volts - BATTERY_EMPTY_VOLTS) / (BATTERY_FULL_VOLTS - BATTERY_EMPTY_VOLTS)
  return Math.round(Math.min(1, Math.max(0, ratio)) * 100)
}

export function signalPercent(dbm: number | null): number | null {
  if (dbm === null) return null
  const ratio = (dbm - RSSI_EMPTY_DBM) / (RSSI_FULL_DBM - RSSI_EMPTY_DBM)
  return Math.round(Math.min(1, Math.max(0, ratio)) * 100)
}

/** An event older than this means the feed is no longer reporting live. */
export const STALE_AFTER_MINUTES = 45

const SPACE_STATES: SpaceState[] = ['OCCUPIED', 'VACANT', 'UNKNOWN']
const SPACE_KINDS: SpaceKind[] = ['Regular', 'Pickup', 'ADA']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function num(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function count(value: unknown): number {
  const parsed = num(value)
  return parsed === null || parsed < 0 ? 0 : Math.round(parsed)
}

function isoOrNull(value: unknown): string | null {
  const raw = typeof value === 'string' ? value : null
  if (!raw) return null
  const time = Date.parse(raw)
  return Number.isNaN(time) ? null : new Date(time).toISOString()
}

export function slugify(label: string): string {
  return (
    label
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'space'
  )
}

function parseHistory(value: unknown): HistoryPoint[] {
  if (!Array.isArray(value)) return []
  const points: HistoryPoint[] = []
  for (const entry of value) {
    if (!isRecord(entry)) continue
    const hour = num(entry.hour)
    if (hour === null || hour < 0 || hour > 23) continue
    const rate = num(entry.occupancy_rate)
    points.push({
      hour: Math.round(hour),
      occupancyRate: rate === null ? null : Math.min(1, Math.max(0, rate)),
      sampleMinutes: count(entry.sample_minutes),
    })
  }
  return points.sort((a, b) => a.hour - b.hour)
}

function parseEvents(value: unknown): SpaceEvent[] {
  if (!Array.isArray(value)) return []
  const events: SpaceEvent[] = []
  for (const entry of value) {
    if (!isRecord(entry)) continue
    const at = isoOrNull(entry.at)
    const state = entry.state === 'OCCUPIED' || entry.state === 'VACANT' ? entry.state : null
    if (at && state) events.push({ at, state })
  }
  return events
}

function parseSparkline(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, 24).map((entry) => count(entry))
}

function parseSpace(value: unknown): FieldSpace | null {
  if (!isRecord(value)) return null

  const label = str(value.label).trim()
  if (!label) return null

  const kind = SPACE_KINDS.find((k) => k === value.kind) ?? 'Regular'
  const state = SPACE_STATES.find((s) => s === value.state) ?? 'UNKNOWN'
  const rate = num(value.occupancy_rate)
  const dwell = num(value.mean_dwell_minutes)
  const vacancy = num(value.mean_vacancy_minutes)
  const turnover = num(value.turnover_per_day)
  const volts = plausibleVolts(num(value.battery_volts))
  const dbm = plausibleDbm(num(value.signal_dbm))

  return {
    key: slugify(label),
    label,
    kind,
    state,
    stateSince: isoOrNull(value.state_since),
    online: value.online === true,
    occupancyRate: rate === null ? null : Math.min(1, Math.max(0, rate)),
    observedMinutes: count(value.observed_minutes),
    completedSessions: count(value.completed_sessions),
    meanDwellMinutes: dwell === null || dwell < 0 ? null : Math.round(dwell),
    meanVacancyMinutes: vacancy === null || vacancy < 0 ? null : Math.round(vacancy),
    turnoverPerDay: turnover === null || turnover < 0 ? null : turnover,
    totalEvents: count(value.total_events),
    lastEventAt: isoOrNull(value.last_event_at),
    batteryVolts: volts,
    batteryPercent: batteryPercent(volts),
    // A low-battery flag only means anything with a real voltage behind it.
    batteryLow: volts !== null && value.battery_flag === 'LOW',
    signalDbm: dbm,
    signalPercent: signalPercent(dbm),
    events24h: parseSparkline(value.events_24h),
    recentEvents: parseEvents(value.recent_events),
    history: parseHistory(value.hours),
  }
}

export function parseAccuracy(value: unknown): FieldAccuracy {
  const source = isRecord(value) ? value : {}
  const validated = count(source.validated_observations)
  const matches = Math.min(count(source.matches), validated)

  return {
    checkIns: count(source.check_ins),
    validatedObservations: validated,
    matches,
    mismatches: validated - matches,
    // The denominator is validated observations, never check-ins or visits.
    accuracyPercent: validated > 0 ? (matches / validated) * 100 : null,
  }
}

/**
 * Turns whatever the RPC returned into the site's DTO, field by field.
 *
 * Nothing is spread or passed through: an unexpected column added upstream
 * cannot reach the browser because it is never read here.
 */
export function parseSnapshot(payload: unknown, now = Date.now()): FieldSnapshot | null {
  if (!isRecord(payload) || payload.published !== true) return null

  const site = isRecord(payload.site) ? payload.site : {}
  const name = str(site.name).trim()
  const city = str(site.city).trim()
  if (!name || !city) return null

  const daysElapsed = num(site.days_elapsed)
  const scheduledDays = num(site.scheduled_days)

  const spaces = Array.isArray(payload.spaces)
    ? payload.spaces.map(parseSpace).filter((s): s is FieldSpace => s !== null)
    : []

  const lastEventAt = isoOrNull(payload.last_event_at)
  const generatedAt = isoOrNull(payload.generated_at) ?? new Date(now).toISOString()
  const monitored = count(payload.spaces_monitored)

  return {
    site: {
      name,
      city,
      startedAt: isoOrNull(site.started_at),
      expectedEndAt: isoOrNull(site.expected_end_at),
      timeZone: str(site.time_zone, 'America/Chicago'),
      daysElapsed: daysElapsed === null ? null : Math.max(0, Math.round(daysElapsed)),
      scheduledDays: scheduledDays === null ? null : Math.max(0, Math.round(scheduledDays)),
    },
    generatedAt,
    windowStart: isoOrNull(payload.window_start) ?? generatedAt,
    windowDays: Math.max(1, count(payload.window_days) || 7),
    lastEventAt,
    stale:
      lastEventAt === null ||
      now - Date.parse(lastEventAt) > STALE_AFTER_MINUTES * 60 * 1000,
    spacesMonitored: monitored || spaces.length,
    spacesOnline: Math.min(count(payload.spaces_online), monitored || spaces.length),
    spacesOffline: Math.min(count(payload.spaces_offline), monitored || spaces.length),
    occupancyEvents: count(payload.occupancy_events),
    spaces,
    accuracy: parseAccuracy(payload.accuracy),
  }
}

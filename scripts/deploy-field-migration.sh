#!/usr/bin/env bash
#
# Applies the public field read model to the pilot Supabase project.
#
# The migration is additive and idempotent: CREATE TABLE IF NOT EXISTS,
# CREATE OR REPLACE FUNCTION, INSERT ... ON CONFLICT DO NOTHING. It contains no
# DROP, DELETE, TRUNCATE or UPDATE, and every ALTER/GRANT names only the two
# public_field_* tables it creates. Re-running it does not reset is_published.
#
# Usage:
#   1. Put the connection URI in .env.deploy.local (gitignored):
#        SUPABASE_DB_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
#   2. ./scripts/deploy-field-migration.sh
#
# The URI is never echoed.

set -euo pipefail

MIGRATION="supabase/migrations/20260902000000_public_field_read_model.sql"
ENV_FILE=".env.deploy.local"

if [[ -z "${SUPABASE_DB_URL:-}" && -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a; source "$ENV_FILE"; set +a
fi

if [[ -z "${SUPABASE_DB_URL:-}" ]]; then
  echo "SUPABASE_DB_URL is not set. Put it in $ENV_FILE — see the header of this file." >&2
  exit 1
fi

if [[ ! -f "$MIGRATION" ]]; then
  echo "Migration not found: $MIGRATION" >&2
  exit 1
fi

host_only() { sed -E 's#^.*@##; s#/.*$##' <<<"$1"; }
echo "Target:    $(host_only "$SUPABASE_DB_URL")"
echo "Migration: $MIGRATION ($(wc -l < "$MIGRATION" | tr -d ' ') lines)"
echo

echo "--- connectivity ---"
psql "$SUPABASE_DB_URL" -Atc "select 'connected as ' || current_user || ' to ' || current_database();"

echo
echo "--- before ---"
psql "$SUPABASE_DB_URL" -Atc "
  select 'public_field_snapshot exists: ' || (to_regprocedure('public.public_field_snapshot()') is not null)::text;"

echo
echo "--- applying (single transaction, rolls back on any error) ---"
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 --single-transaction -f "$MIGRATION"

echo
echo "--- after ---"
psql "$SUPABASE_DB_URL" -Atc "
  select 'public_field_snapshot exists: ' || (to_regprocedure('public.public_field_snapshot()') is not null)::text;"
psql "$SUPABASE_DB_URL" -c "
  select public_label, public_kind, sort_order
  from public.public_field_spaces order by sort_order;"
psql "$SUPABASE_DB_URL" -c "
  select public_name, public_city, is_published, window_days
  from public.public_field_sites;"

echo "--- snapshot smoke test (this is public data) ---"
psql "$SUPABASE_DB_URL" -Atc "
  with s as (select public.public_field_snapshot() as doc)
  select format(
    'published=%s spaces=%s online=%s events=%s dwell_field=%s',
    doc->>'published',
    jsonb_array_length(doc->'spaces'),
    doc->>'spaces_online',
    doc->>'occupancy_events',
    (doc->'spaces'->0 ? 'mean_dwell_minutes')::text
  ) from s;"

echo
echo "Done."

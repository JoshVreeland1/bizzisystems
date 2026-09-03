# Supabase migrations

Bizzi runs a single Supabase project — the one behind the pilot platform — so
both migrations go there. Each is additive and neither touches sensors,
occupancy_events, ingestion, existing RLS or any pilot grant.

| Migration | Purpose |
| --- | --- |
| `20260902000000_public_field_read_model.sql` | Adds the public allowlists and the sanitized `public_field_snapshot()` RPC that bizzisystems.com reads. |
| `20260902010000_deployment_inquiries.sql` | Creates the insert-only table behind the `/contact` qualification form. |

If a separate marketing project is created later, move `deployment_inquiries`
there and set `SITE_SUPABASE_URL` / `SITE_SUPABASE_ANON_KEY`. Unset, the site
falls back to the field project.

## Confirming what the anon role can reach

The site holds the project's **anon** key, so it is worth knowing exactly what
that key can do.

Supabase's default setup grants `anon` and `authenticated` every privilege on
new tables in `public` and relies on row-level security to gate them. So a long
grant list is expected and is not itself a finding. What matters is the
policies, because **RLS being enabled is not the same as anon being blocked** —
a policy written `TO public` admits anon.

### The definitive check

Ask the API the way an attacker would, with the anon key:

```bash
ANON="<anon key>"
URL="https://<project>.supabase.co/rest/v1"

for t in sensors occupancy_events system_health_log pilot_config profiles waitlist; do
  printf '%-20s ' "$t"
  curl -s "$URL/$t?select=*&limit=1" -H "apikey: $ANON" -H "Authorization: Bearer $ANON"
  echo
done
```

`[]` means RLS is blocking the read. Rows coming back mean that table is
readable by anyone holding the key.

### Why, if something does come back

```sql
select tablename, policyname, roles, cmd, qual
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

`roles` of `{authenticated}` is fine. `{public}` includes anon.

### TRUNCATE is the one RLS cannot cover

Row-level security applies to SELECT, INSERT, UPDATE and DELETE. It does not
apply to TRUNCATE, which is governed by the table grant alone. PostgREST
exposes no TRUNCATE verb and `anon` cannot log in directly, so this is not
reachable through the normal API surface — but the grant buys nothing and is
worth dropping:

```sql
revoke truncate on public.sensors, public.occupancy_events,
  public.system_health_log, public.pilot_config, public.profiles,
  public.waitlist from anon;
```

### Tightening the rest

The public website needs `anon` to do exactly two things: execute
`public_field_snapshot()` and insert into `deployment_inquiries`. Neither needs
a table grant on any pilot table — the snapshot function is SECURITY DEFINER
and runs as its owner. The pilot dashboard uses the `authenticated` role, which
these statements do not touch:

```sql
revoke all on public.sensors            from anon;
revoke all on public.occupancy_events   from anon;
revoke all on public.system_health_log  from anon;
revoke all on public.pilot_config       from anon;
```

Before revoking on `profiles`, check whether anything runs against it before a
user signs in (a login screen, an invite-acceptance page). If not:

```sql
revoke all on public.profiles from anon;
```

`waitlist` backed the retired form on the old site and nothing writes to it now,
so it can be closed entirely:

```sql
revoke all on public.waitlist from anon;
```

After any revoke, load the pilot dashboard and sign in to confirm nothing broke.

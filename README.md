# bizzisystems.com

Public marketing site for Bizzi Systems, Inc. Next.js 14 (App Router), React 18,
TypeScript strict, Tailwind v4. Deployed on Vercel.

This repository is the public site only. It contains no pilot-platform code and
never writes to the pilot database.

## Commands

```
npm run dev         # local dev server
npm run build       # production build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm test            # vitest
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | What Bizzi measures, live field proof, the two market paths |
| `/platform` | Sensor, connectivity and software as one system |
| `/cities` | Municipal parking and curb use case |
| `/warehouses` | Bay-level dwell use case |
| `/validation` | The running Austin deployment, its data and its limits |
| `/company` | Chronology and team |
| `/contact` | Qualification form ahead of a meeting |
| `/privacy` | What the site and the product collect |

Retired routes (`/team`, `/investors`, `/waitlist`, `/terms`, `/universities`)
redirect permanently in `next.config.js`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `BIZZI_FIELD_SUPABASE_URL` | for live data | Pilot Supabase project URL |
| `BIZZI_FIELD_ANON_KEY` | for live data | Pilot project **anon** key. Never the service-role key. |
| `SITE_SUPABASE_URL` | optional | Only if contact-form submissions move to their own project. Falls back to `BIZZI_FIELD_SUPABASE_URL`. |
| `SITE_SUPABASE_ANON_KEY` | optional | As above, falls back to `BIZZI_FIELD_ANON_KEY`. |
| `NEXT_PUBLIC_SCHEDULER_URL` | optional | Google Appointment Schedule link, shown after the contact form is submitted. |

Both forms of the Google link are accepted and behave differently, because
Google serves them differently:

| Pasted value | What the site does | Why |
| --- | --- | --- |
| `https://calendar.app.google/…` | Renders a **Pick a time** button that opens the booking page in a new tab | The short link answers `X-Frame-Options: SAMEORIGIN` on its redirect hops, so an iframe would be blank |
| `https://calendar.google.com/calendar/appointments/schedules/…` | Embeds it inline, adding `gv=true`, with an "Open the booking page" link underneath | This URL sets no framing restriction |

Either way the confirmation step always offers a reachable link, so a blocked
frame can never strand someone mid-booking.

Nothing about the live field feed is exposed to the browser: both field
variables are server-only, and the page talks to one sanitized RPC.

With the field variables unset the site renders its "feed unavailable" states.
It never falls back to sample data — see `lib/field-data/`.

## The public field feed

`supabase/README.md` covers the migration, the allowlist, and how to publish or
unpublish the field site. The short version:

- The site calls exactly one function, `public_field_snapshot()`, which returns
  aggregate occupancy and validation counts.
- `lib/field-data/parse.ts` re-reads that response field by field, so an
  unexpected column added upstream cannot reach the browser.
- `app/api/public/field-data/route.ts` exports only `GET`. There is no public
  mutation path.

## Field-site anonymity

The public feed carries no host name, street address or coordinates. The site
name shown on `/validation` is `public_field_sites.public_name`, set by an admin
in the pilot database, and defaults to a generic label. Naming a host is a
one-row `UPDATE`, never a code change.

## Images

Unedited originals live in `assets/photo-originals/`, outside `public/` so they
are never served. After adding or replacing anything under `public/`:

    npm run images:strip

That removes EXIF from JPEGs and metadata chunks from PNGs, losslessly. Phone
photographs carry GPS coordinates, and the field site is anonymous on this
site — `tests/image-metadata.test.ts` fails the build if any served image still
carries metadata.

## Claim discipline

`tests/copy-discipline.test.ts` fails the build if unsupported claims, pipeline
company names, or marketing filler reappear in `app/` or `lib/`. Adding a phrase
to that list is the way to retire a claim permanently.

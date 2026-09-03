export const SITE_URL = 'https://www.bizzisystems.com'

export const SITE_NAME = 'Bizzi Systems'

export const PRIMARY_CTA = {
  label: 'Discuss a deployment',
  href: '/contact',
} as const

export interface NavChild {
  label: string
  href: string
  summary: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavChild[]
}

export const NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Platform', href: '/platform' },
  {
    label: 'Markets',
    href: '/cities',
    children: [
      {
        label: 'Cities',
        href: '/cities',
        summary: 'Stall-level occupancy, dwell and turnover for parking and curb teams.',
      },
      {
        label: 'Warehouses',
        href: '/warehouses',
        summary: 'Bay occupancy and dwell records for distribution and logistics operations.',
      },
    ],
  },
  { label: 'Validation', href: '/validation' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
]

/**
 * The field site as the public sees it.
 *
 * Deliberately anonymous: no host name, no street address, no coordinates.
 * The display name comes from public_field_sites.public_name in the pilot
 * database, so naming the host is a deliberate one-row edit rather than
 * something baked into the site. This value is only the fallback used when the
 * feed is unreachable.
 */
export const FIELD_SITE = {
  name: 'Austin field site',
  city: 'Austin, Texas',
} as const

export const CONTACT_EMAIL = 'josh@bizzisystems.com'

/** Both founders are on every inbound thread. */
export const CONTACT_MAILTO =
  'mailto:josh@bizzisystems.com,michael@bizzisystems.com' +
  '?subject=' +
  encodeURIComponent('Bizzi deployment inquiry')

export const COMPANY_ADDRESS = {
  street: '1700 S Lamar Blvd, Suite 338',
  locality: 'Austin',
  region: 'TX',
  postalCode: '78704',
  country: 'US',
  oneLine: '1700 S Lamar Blvd, Suite 338, Austin, Texas 78704',
} as const

/**
 * Embedded scheduler.
 *
 * Google gives out two forms of an appointment-schedule link and they behave
 * differently in a frame. The `calendar.app.google/...` short link answers with
 * `X-Frame-Options: SAMEORIGIN` on its redirect hops, so framing it yields a
 * blank box; the `calendar.google.com/calendar/appointments/schedules/...` URL
 * it resolves to sets no framing restriction and embeds fine, provided
 * `gv=true` is present.
 *
 * Rather than trust whoever pastes the environment variable to know that, the
 * short form falls back to a button that opens the booking page in a new tab.
 * A blank iframe on the primary conversion path is the worst outcome here.
 */
export type SchedulerMode = 'embed' | 'link' | 'none'

export interface SchedulerConfig {
  url: string
  mode: SchedulerMode
}

export function resolveScheduler(raw: string): SchedulerConfig {
  const trimmed = raw.trim()
  if (!trimmed) return { url: '', mode: 'none' }

  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    // A malformed value disables the scheduler rather than breaking the page.
    return { url: '', mode: 'none' }
  }

  if (url.protocol !== 'https:') return { url: '', mode: 'none' }

  if (url.hostname === 'calendar.app.google') {
    return { url: url.toString(), mode: 'link' }
  }

  if (
    url.hostname.endsWith('calendar.google.com') &&
    url.pathname.includes('/appointments/schedules/')
  ) {
    url.searchParams.set('gv', 'true')
    return { url: url.toString(), mode: 'embed' }
  }

  return { url: url.toString(), mode: 'embed' }
}

export const SCHEDULER = resolveScheduler(process.env.NEXT_PUBLIC_SCHEDULER_URL ?? '')

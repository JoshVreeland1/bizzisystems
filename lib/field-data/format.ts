/**
 * Formatting for field data. Every function is deterministic given its inputs
 * so server and client markup agree; anything that depends on "now" takes the
 * current time as an argument rather than reading the clock itself.
 */

export function formatPercent(rate: number | null, digits = 1): string {
  if (rate === null) return '—'
  return `${(rate * 100).toFixed(digits)}%`
}

export function formatMinutes(minutes: number | null): string {
  if (minutes === null || minutes < 0) return '—'
  if (minutes < 60) return `${Math.round(minutes)}m`
  const hours = Math.floor(minutes / 60)
  const rest = Math.round(minutes % 60)
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

/** Wall-clock time at the field site, e.g. "2:14 PM CDT". */
export function formatSiteTime(iso: string | null, timeZone: string): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone,
  }).format(new Date(iso))
}

/** Calendar date at the field site, e.g. "September 1, 2026". */
export function formatSiteDate(iso: string | null, timeZone: string): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  }).format(new Date(iso))
}

/**
 * How much history actually sits behind the rates on screen.
 *
 * The reading window is configured in days, but a new deployment has far less
 * history than that — the query clamps to the pilot's start date. Printing the
 * configured window would tell a visitor the numbers cover a week when they
 * cover an afternoon.
 */
export function formatObservedWindow(windowStart: string, generatedAt: string): string {
  const hours = (Date.parse(generatedAt) - Date.parse(windowStart)) / 3_600_000
  if (!Number.isFinite(hours) || hours <= 0) return 'the deployment so far'
  if (hours < 2) return 'the last hour'
  if (hours < 48) return `the last ${Math.round(hours)} hours`
  return `the last ${Math.round(hours / 24)} days`
}

export function formatHourLabel(hour: number): string {
  if (hour === 0) return '12a'
  if (hour === 12) return '12p'
  return hour < 12 ? `${hour}a` : `${hour - 12}p`
}

export function formatElapsed(iso: string | null, now: number): string {
  if (!iso) return '—'
  const seconds = Math.max(0, Math.round((now - Date.parse(iso)) / 1000))
  if (seconds < 45) return 'just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`
  const days = Math.round(hours / 24)
  return days === 1 ? '1 day ago' : `${days} days ago`
}

/** How long a space has held its current state. */
export function formatHeldFor(iso: string | null, now: number): string | null {
  if (!iso) return null
  const minutes = Math.max(0, Math.round((now - Date.parse(iso)) / 60000))
  return formatMinutes(minutes)
}

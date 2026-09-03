'use client'

/**
 * Provider-agnostic event reporting.
 *
 * The site ships with no analytics vendor. Rather than adding one (and the
 * tracking that comes with it), every conversion-relevant interaction calls
 * track() and that call hands off to whichever provider is present on the page.
 * Vercel Analytics, Plausible and GTM are all detected at call time. With none
 * installed this is a no-op, so adding a provider later requires no edits here.
 *
 * Payloads carry page context only. No names, emails or form contents.
 */

type EventName =
  | 'discuss_deployment_click'
  | 'scheduler_open'
  | 'scheduler_complete'
  | 'city_page_view'
  | 'warehouse_page_view'
  | 'validation_interaction'
  | 'platform_interaction'

type Props = Record<string, string | number | boolean>

interface AnalyticsWindow extends Window {
  va?: (event: 'event', payload: { name: string } & Props) => void
  plausible?: (name: string, options?: { props: Props }) => void
  dataLayer?: unknown[]
}

export function track(name: EventName, props: Props = {}): void {
  if (typeof window === 'undefined') return

  const w = window as AnalyticsWindow
  const payload: Props = { ...props, path: window.location.pathname }

  try {
    w.va?.('event', { name, ...payload })
    w.plausible?.(name, { props: payload })
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: name, ...payload })
    }
  } catch {
    // Reporting must never break an interaction.
  }
}

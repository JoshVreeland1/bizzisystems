import { describe, expect, it } from 'vitest'
import { resolveScheduler } from '@/lib/site'

/**
 * Verified against the live endpoints on 2026-09-02:
 *   calendar.app.google/…            → 302, X-Frame-Options: SAMEORIGIN  (cannot frame)
 *   calendar.google.com/…/schedules/ → 200, no framing restriction       (frames fine)
 * A blank iframe on the primary conversion path is the failure to avoid.
 */
const SHORT = 'https://calendar.app.google/6LM1GJo45TdmDbfQ6'
const RESOLVED =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ34v2SbTd0sg'

describe('resolveScheduler', () => {
  it('opens the un-framable short link in a new tab instead of embedding it', () => {
    expect(resolveScheduler(SHORT)).toEqual({ url: SHORT, mode: 'link' })
  })

  it('embeds the resolved schedule URL and adds the embed parameter', () => {
    expect(resolveScheduler(RESOLVED)).toEqual({
      url: `${RESOLVED}?gv=true`,
      mode: 'embed',
    })
  })

  it('does not duplicate the embed parameter', () => {
    const { url } = resolveScheduler(`${RESOLVED}?gv=true`)
    expect(url.match(/gv=true/g)).toHaveLength(1)
  })

  it('tolerates whitespace from a paste', () => {
    expect(resolveScheduler(`  ${SHORT}  `).mode).toBe('link')
  })

  it('embeds other booking providers unchanged', () => {
    expect(resolveScheduler('https://cal.com/bizzi/deployment')).toEqual({
      url: 'https://cal.com/bizzi/deployment',
      mode: 'embed',
    })
  })

  it('disables the scheduler rather than breaking the page', () => {
    for (const bad of ['', '   ', 'not a url', 'http://calendar.app.google/x']) {
      expect(resolveScheduler(bad)).toEqual({ url: '', mode: 'none' })
    }
  })
})

import { describe, expect, it } from 'vitest'
import {
  formatCount,
  formatElapsed,
  formatHeldFor,
  formatHourLabel,
  formatMinutes,
  formatObservedWindow,
  formatPercent,
  formatSiteDate,
  formatSiteTime,
} from '@/lib/field-data/format'

describe('formatPercent', () => {
  it('renders an em dash rather than a zero for a missing rate', () => {
    expect(formatPercent(null)).toBe('—')
  })

  it('keeps one decimal by default', () => {
    expect(formatPercent(0.388)).toBe('38.8%')
    expect(formatPercent(0.865, 0)).toBe('87%')
  })
})

describe('formatMinutes', () => {
  it('stays in minutes under an hour', () => {
    expect(formatMinutes(14)).toBe('14m')
  })

  it('splits into hours and minutes above one', () => {
    expect(formatMinutes(108)).toBe('1h 48m')
    expect(formatMinutes(120)).toBe('2h')
  })

  it('has nothing to show for a missing duration', () => {
    expect(formatMinutes(null)).toBe('—')
    expect(formatMinutes(-5)).toBe('—')
  })
})

describe('formatHourLabel', () => {
  it('reads as a clock hour', () => {
    expect(formatHourLabel(0)).toBe('12a')
    expect(formatHourLabel(9)).toBe('9a')
    expect(formatHourLabel(12)).toBe('12p')
    expect(formatHourLabel(14)).toBe('2p')
  })
})

describe('formatElapsed', () => {
  const now = Date.parse('2026-09-02T18:00:00Z')

  it('describes recent readings loosely', () => {
    expect(formatElapsed('2026-09-02T17:59:50Z', now)).toBe('just now')
    expect(formatElapsed('2026-09-02T17:45:00Z', now)).toBe('15 min ago')
    expect(formatElapsed('2026-09-02T15:00:00Z', now)).toBe('3 hours ago')
    expect(formatElapsed('2026-08-31T18:00:00Z', now)).toBe('2 days ago')
  })

  it('has nothing to say without a timestamp', () => {
    expect(formatElapsed(null, now)).toBe('—')
  })
})

describe('formatHeldFor', () => {
  it('measures forward from the state change', () => {
    const now = Date.parse('2026-09-02T18:00:00Z')
    expect(formatHeldFor('2026-09-02T17:19:00Z', now)).toBe('41m')
    expect(formatHeldFor(null, now)).toBeNull()
  })
})

describe('site clock', () => {
  it('renders in the field site time zone, not the server time zone', () => {
    // 18:00 UTC is 1 p.m. in Austin during daylight time.
    // Intl separates the meridiem with either a plain space or a narrow
    // no-break space depending on the ICU build; normalise before comparing.
    const clock = formatSiteTime('2026-09-02T18:00:00Z', 'America/Chicago')
    expect(clock.replace(/\s+/g, ' ')).toBe('1:00 PM CDT')
    expect(formatSiteDate('2026-09-02T02:00:00Z', 'America/Chicago')).toBe('September 1, 2026')
  })
})

describe('formatCount', () => {
  it('groups thousands', () => {
    expect(formatCount(103)).toBe('103')
    expect(formatCount(12045)).toBe('12,045')
  })
})

describe('formatObservedWindow', () => {
  it('reports hours while a deployment is young', () => {
    // Josh's first real payload: 7-day window configured, 33 hours of history.
    expect(
      formatObservedWindow('2026-09-01T13:30:00Z', '2026-09-02T22:49:15Z')
    ).toBe('the last 33 hours')
  })

  it('switches to days once there are more than two', () => {
    expect(formatObservedWindow('2026-08-26T00:00:00Z', '2026-09-02T00:00:00Z')).toBe(
      'the last 7 days'
    )
  })

  it('never claims a window it does not have', () => {
    expect(formatObservedWindow('2026-09-02T00:00:00Z', '2026-09-02T00:00:00Z')).toBe(
      'the deployment so far'
    )
    expect(formatObservedWindow('bad', 'worse')).toBe('the deployment so far')
  })
})

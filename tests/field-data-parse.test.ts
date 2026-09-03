import { describe, expect, it } from 'vitest'
import {
  batteryPercent,
  parseAccuracy,
  parseSnapshot,
  signalPercent,
  slugify,
  STALE_AFTER_MINUTES,
} from '@/lib/field-data/parse'

const NOW = Date.parse('2026-09-02T18:00:00Z')

function payload(overrides: Record<string, unknown> = {}) {
  return {
    published: true,
    generated_at: '2026-09-02T18:00:00Z',
    window_start: '2026-08-26T18:00:00Z',
    window_days: 7,
    site: {
      name: 'Austin field site',
      city: 'Austin, Texas',
      started_at: '2026-09-01T13:30:00Z',
      expected_end_at: '2026-10-01T04:59:59Z',
      status: 'ACTIVE',
      time_zone: 'America/Chicago',
      days_elapsed: 1,
      scheduled_days: 30,
    },
    spaces_monitored: 3,
    spaces_online: 3,
    spaces_offline: 0,
    occupancy_events: 103,
    last_event_at: '2026-09-02T17:50:00Z',
    accuracy: { check_ins: 0, validated_observations: 0, matches: 0, mismatches: 0 },
    spaces: [
      {
        label: 'Space 1',
        kind: 'Regular',
        sort_order: '0001',
        online: true,
        state: 'OCCUPIED',
        state_since: '2026-09-02T17:20:00Z',
        occupancy_rate: 0.865,
        observed_minutes: 900,
        completed_sessions: 12,
        mean_dwell_minutes: 14,
        hours: [
          { hour: 8, occupancy_rate: 0.5, sample_minutes: 60 },
          { hour: 9, occupancy_rate: null, sample_minutes: 0 },
        ],
      },
    ],
    ...overrides,
  }
}

describe('parseSnapshot', () => {
  it('reads the documented fields', () => {
    const snapshot = parseSnapshot(payload(), NOW)!

    expect(snapshot.site.name).toBe('Austin field site')
    expect(snapshot.spacesMonitored).toBe(3)
    expect(snapshot.spacesOnline).toBe(3)
    expect(snapshot.spacesOffline).toBe(0)
    expect(snapshot.site.daysElapsed).toBe(1)
    expect(snapshot.site.scheduledDays).toBe(30)
    expect(snapshot.occupancyEvents).toBe(103)
    expect(snapshot.windowDays).toBe(7)
    expect(snapshot.spaces).toHaveLength(1)
    expect(snapshot.spaces[0]).toMatchObject({
      key: 'space-1',
      label: 'Space 1',
      kind: 'Regular',
      state: 'OCCUPIED',
      completedSessions: 12,
      meanDwellMinutes: 14,
    })
  })

  it('returns null when the site has not been published', () => {
    expect(parseSnapshot({ published: false }, NOW)).toBeNull()
    expect(parseSnapshot(null, NOW)).toBeNull()
    expect(parseSnapshot('nope', NOW)).toBeNull()
  })

  it('leaves deployment length null when the pilot has no dates', () => {
    const snapshot = parseSnapshot(
      payload({
        site: { name: 'Austin field site', city: 'Austin, Texas', time_zone: 'America/Chicago' },
      }),
      NOW
    )!
    expect(snapshot.site.daysElapsed).toBeNull()
    expect(snapshot.site.scheduledDays).toBeNull()
    expect(snapshot.site.expectedEndAt).toBeNull()
  })

  it('cannot report more sensors down than are monitored', () => {
    const snapshot = parseSnapshot(payload({ spaces_offline: 99 }), NOW)!
    expect(snapshot.spacesOffline).toBe(3)
  })

  it('returns null when the site block is incomplete', () => {
    expect(parseSnapshot(payload({ site: { name: '', city: '' } }), NOW)).toBeNull()
  })

  it('marks the feed stale once the last event ages out', () => {
    const fresh = parseSnapshot(payload(), NOW)!
    expect(fresh.stale).toBe(false)

    const later = NOW + (STALE_AFTER_MINUTES + 5) * 60_000
    expect(parseSnapshot(payload(), later)!.stale).toBe(true)
  })

  it('treats a missing last event as stale', () => {
    expect(parseSnapshot(payload({ last_event_at: null }), NOW)!.stale).toBe(true)
  })

  it('drops malformed spaces rather than rendering them', () => {
    const snapshot = parseSnapshot(
      payload({ spaces: [{ label: '' }, 'garbage', null, { label: 'Space 9' }] }),
      NOW
    )!
    expect(snapshot.spaces.map((space) => space.label)).toEqual(['Space 9'])
  })

  it('clamps an out-of-range occupancy rate', () => {
    const snapshot = parseSnapshot(
      payload({ spaces: [{ label: 'Space 1', occupancy_rate: 4.2 }] }),
      NOW
    )!
    expect(snapshot.spaces[0].occupancyRate).toBe(1)
  })

  it('keeps only real hours in the history', () => {
    const snapshot = parseSnapshot(
      payload({
        spaces: [
          {
            label: 'Space 1',
            hours: [
              { hour: 25, occupancy_rate: 0.5 },
              { hour: -1, occupancy_rate: 0.5 },
              { hour: 3, occupancy_rate: 0.25, sample_minutes: 60 },
            ],
          },
        ],
      }),
      NOW
    )!
    expect(snapshot.spaces[0].history).toEqual([
      { hour: 3, occupancyRate: 0.25, sampleMinutes: 60 },
    ])
  })

  it('falls back to a known kind and state for unrecognised values', () => {
    const snapshot = parseSnapshot(
      payload({ spaces: [{ label: 'Space 1', kind: 'Helipad', state: 'ON_FIRE' }] }),
      NOW
    )!
    expect(snapshot.spaces[0].kind).toBe('Regular')
    expect(snapshot.spaces[0].state).toBe('UNKNOWN')
  })
})

describe('parseAccuracy', () => {
  it('has no percentage without validated observations', () => {
    const accuracy = parseAccuracy({ check_ins: 0, validated_observations: 0, matches: 0 })
    expect(accuracy.accuracyPercent).toBeNull()
    expect(accuracy.validatedObservations).toBe(0)
  })

  it('divides by validated observations, not by check-ins', () => {
    const accuracy = parseAccuracy({
      check_ins: 5,
      validated_observations: 25,
      matches: 24,
      mismatches: 1,
    })
    expect(accuracy.accuracyPercent).toBeCloseTo(96, 5)
    expect(accuracy.mismatches).toBe(1)
  })

  it('cannot report more matches than observations', () => {
    const accuracy = parseAccuracy({ validated_observations: 3, matches: 99 })
    expect(accuracy.matches).toBe(3)
    expect(accuracy.mismatches).toBe(0)
    expect(accuracy.accuracyPercent).toBe(100)
  })

  it('treats missing counts as zero rather than as a rate', () => {
    const accuracy = parseAccuracy(undefined)
    expect(accuracy).toEqual({
      checkIns: 0,
      validatedObservations: 0,
      matches: 0,
      mismatches: 0,
      accuracyPercent: null,
    })
  })
})

describe('slugify', () => {
  it('makes a DOM-safe key', () => {
    expect(slugify('Space 1')).toBe('space-1')
    expect(slugify('ADA — north')).toBe('ada-north')
    expect(slugify('!!!')).toBe('space')
  })
})

describe('hardware health', () => {
  it('maps voltage to percent exactly as the operator dashboard does', () => {
    // 3.5V = 0%, 4.2V = 100%, clamped at both ends.
    expect(batteryPercent(3.5)).toBe(0)
    expect(batteryPercent(4.2)).toBe(100)
    expect(batteryPercent(3.74)).toBe(34)
    expect(batteryPercent(4.05)).toBe(79)
    expect(batteryPercent(2.0)).toBe(0)
    expect(batteryPercent(9.9)).toBe(100)
    expect(batteryPercent(null)).toBeNull()
  })

  it('maps RSSI to percent exactly as the operator dashboard does', () => {
    // -90 dBm = 0%, -50 dBm = 100%.
    expect(signalPercent(-90)).toBe(0)
    expect(signalPercent(-50)).toBe(100)
    expect(signalPercent(-70)).toBe(50)
    expect(signalPercent(-116)).toBe(0)
    expect(signalPercent(null)).toBeNull()
  })
})

describe('sensor-card fields', () => {
  const space = parseSnapshot(
    payload({
      spaces: [
        {
          label: 'Space 1',
          kind: 'Regular',
          state: 'OCCUPIED',
          online: true,
          total_events: 412,
          last_event_at: '2026-09-02T17:54:00Z',
          battery_volts: 3.74,
          battery_flag: 'LOW',
          signal_dbm: -116,
          mean_vacancy_minutes: 9,
          turnover_per_day: 17.3,
          events_24h: [2, 1, 0, 0],
          recent_events: [
            { at: '2026-09-02T17:54:00Z', state: 'OCCUPIED' },
            { at: '2026-09-02T17:02:00Z', state: 'VACANT' },
            { at: 'garbage', state: 'VACANT' },
            { at: '2026-09-02T16:00:00Z', state: 'SIDEWAYS' },
          ],
        },
      ],
    }),
    NOW
  )!.spaces[0]

  it('carries the health readings the operator cards show', () => {
    expect(space.totalEvents).toBe(412)
    expect(space.batteryVolts).toBe(3.74)
    expect(space.batteryPercent).toBe(34)
    expect(space.batteryLow).toBe(true)
    expect(space.signalDbm).toBe(-116)
    expect(space.turnoverPerDay).toBe(17.3)
    expect(space.meanVacancyMinutes).toBe(9)
  })

  it('drops malformed events rather than rendering them', () => {
    expect(space.recentEvents).toEqual([
      { at: '2026-09-02T17:54:00.000Z', state: 'OCCUPIED' },
      { at: '2026-09-02T17:02:00.000Z', state: 'VACANT' },
    ])
  })

  it('keeps the sparkline to 24 buckets of counts', () => {
    expect(space.events24h).toEqual([2, 1, 0, 0])
  })

  it('never exposes runtime, which the operator card shows but this does not', () => {
    expect(JSON.stringify(space)).not.toContain('runtime')
  })
})

describe('implausible hardware readings', () => {
  it('drops a corrupt battery voltage rather than printing it', () => {
    const space = parseSnapshot(
      payload({ spaces: [{ label: 'Space 3', battery_volts: 142188, battery_flag: 'LOW' }] }),
      NOW
    )!.spaces[0]
    expect(space.batteryVolts).toBeNull()
    expect(space.batteryPercent).toBeNull()
    expect(space.batteryLow).toBe(false)
  })

  it('drops a corrupt RSSI rather than printing it', () => {
    const space = parseSnapshot(
      payload({ spaces: [{ label: 'Space 3', signal_dbm: 5000 }] }),
      NOW
    )!.spaces[0]
    expect(space.signalDbm).toBeNull()
    expect(space.signalPercent).toBeNull()
  })

  it('keeps a sane reading', () => {
    const space = parseSnapshot(
      payload({ spaces: [{ label: 'Space 1', battery_volts: 3.74, signal_dbm: -116 }] }),
      NOW
    )!.spaces[0]
    expect(space.batteryVolts).toBe(3.74)
    expect(space.signalDbm).toBe(-116)
  })
})

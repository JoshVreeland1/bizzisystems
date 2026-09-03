import { describe, expect, it } from 'vitest'
import { parseSnapshot } from '@/lib/field-data/parse'

/**
 * The parser is the second line of defence behind the SECURITY DEFINER
 * function. If someone later widens the RPC, nothing new should be able to
 * reach the browser, because the parser only reads fields it knows about.
 */
const HOSTILE_PAYLOAD = {
  published: true,
  generated_at: '2026-09-02T18:00:00Z',
  window_days: 7,
  spaces_monitored: 3,
  spaces_online: 3,
  occupancy_events: 103,
  last_event_at: '2026-09-02T17:50:00Z',
  site: {
    name: 'Austin field site',
    city: 'Austin, Texas',
    time_zone: 'America/Chicago',
    // Fields the RPC does not return, included here to prove they cannot pass
    // through the parser even if it did.
    location_name: 'Honest Mary’s',
    address: '4800 Burnet Rd, Ste C300, Austin, TX 78756',
    notes: 'internal note about the host',
  },
  accuracy: {
    check_ins: 2,
    validated_observations: 6,
    matches: 6,
    mismatches: 0,
    discrepancy_note: 'observer thought R1 looked wrong',
    checked_by: '2f0c9f7e-0000-4000-8000-000000000abc',
    checker_email: 'staff@bizzisystems.com',
  },
  spaces: [
    {
      label: 'Space 1',
      kind: 'Regular',
      state: 'OCCUPIED',
      online: true,
      occupancy_rate: 0.5,
      device_eui: 'A8610A3135303438',
      sensor_id: '9a1f0d2c-0000-4000-8000-0000000000ff',
      stall_id: 'R1',
      display_name: 'Sensor 1 - Burnet Rd',
      address: '4800 Burnet Rd',
      latitude: 30.3213,
      longitude: -97.7405,
      rssi: -116,
      battery_voltage: 3.74,
      battery_flag: 'OK',
      runtime_seconds: 918273,
      uptime_start: '2026-09-01T13:30:00Z',
      magnetic_delta: 41.2,
      raw_payload: { hex: 'deadbeef' },
      gateway_id: 'ug67-outdoor-01',
      unit_id: 'BIZZI-003',
      hours: [{ hour: 8, occupancy_rate: 0.5, sample_minutes: 60 }],
    },
  ],
}

const FORBIDDEN = [
  'Honest Mary',
  'location_name',
  'Burnet',
  'device_eui',
  'deviceEui',
  'A8610A3135303438',
  'sensor_id',
  'sensorId',
  'stall_id',
  'stallId',
  'R1',
  'display_name',
  'Sensor 1 - Burnet Rd',
  '4800 Burnet Rd',
  'latitude',
  'longitude',
  '30.3213',
  '-97.7405',
  'rssi',
  '-116',
  'battery_voltage',
  'batteryVoltage',
  '3.74',
  'battery_flag',
  'runtime_seconds',
  'runtimeSeconds',
  '918273',
  'uptime_start',
  'magnetic_delta',
  'raw_payload',
  'deadbeef',
  'gateway_id',
  'ug67-outdoor-01',
  'unit_id',
  'BIZZI-003',
  'discrepancy_note',
  'checked_by',
  'checker_email',
  'staff@bizzisystems.com',
  'internal note about the host',
]

describe('public snapshot leakage', () => {
  const serialised = JSON.stringify(parseSnapshot(HOSTILE_PAYLOAD, Date.parse('2026-09-02T18:00:00Z')))

  it('parses the payload it is given', () => {
    expect(serialised).toContain('Austin field site')
    expect(serialised).toContain('Space 1')
  })

  it.each(FORBIDDEN)('does not carry %s through to the client', (needle) => {
    expect(serialised).not.toContain(needle)
  })
})

/** Shapes the public website is allowed to know about. Nothing else crosses. */

export type SpaceState = 'OCCUPIED' | 'VACANT' | 'UNKNOWN'

export type SpaceKind = 'Regular' | 'Pickup' | 'ADA'

export interface HistoryPoint {
  /** Hour of day, 0–23, in the field site's local time. */
  hour: number
  /** 0–1, or null when that hour has no observed time behind it. */
  occupancyRate: number | null
  sampleMinutes: number
}

export interface SpaceEvent {
  at: string
  state: 'OCCUPIED' | 'VACANT'
}

export interface FieldSpace {
  /** URL- and DOM-safe key derived from the label. */
  key: string
  label: string
  kind: SpaceKind
  state: SpaceState
  stateSince: string | null
  online: boolean
  occupancyRate: number | null
  observedMinutes: number
  completedSessions: number
  /** Mean duration of completed occupancy sessions, matching the pilot report. */
  meanDwellMinutes: number | null
  /** Mean gap between one vehicle leaving and the next arriving. */
  meanVacancyMinutes: number | null
  /** Completed occupancy sessions per observed stall-day. */
  turnoverPerDay: number | null
  totalEvents: number
  lastEventAt: string | null
  /** Hardware health, as shown on the operator sensor cards. No runtime. */
  batteryVolts: number | null
  batteryPercent: number | null
  batteryLow: boolean
  signalDbm: number | null
  signalPercent: number | null
  /** Twenty-four one-hour event counts ending now. */
  events24h: number[]
  recentEvents: SpaceEvent[]
  history: HistoryPoint[]
}

export interface FieldAccuracy {
  checkIns: number
  validatedObservations: number
  matches: number
  mismatches: number
  /**
   * matches / validatedObservations, as a percentage.
   * Null when there is nothing to divide by. Never rendered without the
   * denominator beside it.
   */
  accuracyPercent: number | null
}

export interface FieldSite {
  /** Display name set by an admin. Never the pilot's internal name or host. */
  name: string
  city: string
  startedAt: string | null
  expectedEndAt: string | null
  timeZone: string
  /** Whole days since the deployment started. */
  daysElapsed: number | null
  /** Length of the scheduled period, in days. */
  scheduledDays: number | null
}

export interface FieldSnapshot {
  site: FieldSite
  generatedAt: string
  windowStart: string
  windowDays: number
  lastEventAt: string | null
  /** True when the most recent event is older than the staleness threshold. */
  stale: boolean
  spacesMonitored: number
  spacesOnline: number
  /** Monitored sensors not currently reporting. */
  spacesOffline: number
  occupancyEvents: number
  spaces: FieldSpace[]
  accuracy: FieldAccuracy
}

export type FieldDataResult =
  | { state: 'ok'; snapshot: FieldSnapshot }
  /** No Supabase credentials configured for this environment. */
  | { state: 'unconfigured' }
  /** Configured, but no site has been published to the allowlist yet. */
  | { state: 'unpublished' }
  /** Configured and published, but the read failed or timed out. */
  | { state: 'unavailable' }

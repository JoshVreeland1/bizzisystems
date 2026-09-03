'use client'

import {
  formatCount,
  formatElapsed,
  formatHeldFor,
  formatMinutes,
  formatPercent,
} from '@/lib/field-data/format'
import type { FieldSpace } from '@/lib/field-data/types'

/**
 * The public equivalent of an operator sensor card: state, last event, event
 * count, a 24-hour activity sparkline, battery and signal.
 *
 * Runtime is excluded, as is anything that could identify the hardware or the
 * site — no device EUI, no stall ID, no address, no coordinates.
 */

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line py-2.5 last:border-b-0">
      <span className="shrink-0 text-[13px] text-muted">{label}</span>
      <span data-numeric className="text-right text-[13px] font-medium text-ink">
        {value}
      </span>
    </div>
  )
}

function Meter({ percent, low = false }: { percent: number | null; low?: boolean }) {
  if (percent === null) return null
  return (
    <span
      aria-hidden="true"
      className="ml-2 inline-block h-1.5 w-14 overflow-hidden rounded-full bg-surface-2 align-middle"
    >
      <span
        className={`block h-full rounded-full ${low ? 'bg-occupied' : 'bg-brand'}`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </span>
  )
}

function Sparkline({ counts }: { counts: number[] }) {
  const peak = Math.max(1, ...counts)
  const total = counts.reduce((sum, n) => sum + n, 0)

  return (
    <figure className="m-0">
      <ul
        className="flex h-10 items-end gap-[2px]"
        aria-label={`${formatCount(total)} events over the last 24 hours`}
      >
        {counts.map((n, hour) => (
          <li key={hour} className="flex h-full flex-1 items-end">
            <span
              aria-hidden="true"
              className={`block w-full rounded-t-[1px] ${n > 0 ? 'bg-brand' : 'bg-line'}`}
              style={{ height: n > 0 ? `${Math.max(12, (n / peak) * 100)}%` : '2px' }}
            />
          </li>
        ))}
      </ul>
      <figcaption className="mt-1.5 text-[12px] text-muted">
        Events over the last 24 hours
      </figcaption>
    </figure>
  )
}

export default function SensorDetail({
  space,
  now,
}: {
  space: FieldSpace
  now: number | null
}) {
  const held = now === null ? null : formatHeldFor(space.stateSince, now)
  const word =
    space.state === 'OCCUPIED' ? 'Occupied' : space.state === 'VACANT' ? 'Vacant' : 'No reading'

  return (
    <div className="rounded-md border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[17px] font-semibold text-ink">{space.label}</h3>
          <p className="mt-0.5 text-[13px] text-muted">{space.kind} space</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${
            space.state === 'OCCUPIED'
              ? 'bg-occupied-tint text-occupied'
              : space.state === 'VACANT'
                ? 'bg-vacant-tint text-vacant'
                : 'bg-surface-2 text-muted'
          }`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${
              space.state === 'OCCUPIED'
                ? 'bg-occupied'
                : space.state === 'VACANT'
                  ? 'bg-vacant'
                  : 'bg-muted'
            }`}
          />
          {word}
        </span>
      </div>

      <div className="mt-4 border-t border-line pt-1">
        <Row label="Held for" value={held ?? '—'} />
        <Row
          label="Last event"
          value={now === null ? '—' : formatElapsed(space.lastEventAt ?? space.stateSince, now)}
        />
        <Row label="Events" value={formatCount(space.totalEvents)} />
        <Row label="Occupancy rate" value={formatPercent(space.occupancyRate)} />
        <Row label="Average dwell" value={formatMinutes(space.meanDwellMinutes)} />
        <Row
          label="Connectivity"
          value={
            <span className={space.online ? 'text-vacant' : 'text-muted'}>
              {space.online ? 'Online' : 'Quiet'}
            </span>
          }
        />
        <Row
          label="Battery"
          value={
            space.batteryVolts === null ? (
              '—'
            ) : (
              <>
                {space.batteryVolts.toFixed(2)}V
                <Meter percent={space.batteryPercent} low={space.batteryLow} />
              </>
            )
          }
        />
        <Row
          label="Signal"
          value={
            space.signalDbm === null ? (
              '—'
            ) : (
              <>
                {space.signalDbm} dBm
                <Meter percent={space.signalPercent} />
              </>
            )
          }
        />
      </div>

      {space.batteryLow ? (
        <p className="mt-3 rounded border border-occupied/25 bg-occupied-tint px-3 py-2 text-[12px] font-medium text-occupied">
          Battery low. This unit needs a swap.
        </p>
      ) : null}

      <div className="mt-5 border-t border-line pt-4">
        <Sparkline counts={space.events24h} />
      </div>
    </div>
  )
}

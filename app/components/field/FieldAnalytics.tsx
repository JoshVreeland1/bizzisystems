'use client'

import { useMemo, useState } from 'react'
import { track } from '@/lib/analytics'
import {
  formatCount,
  formatHourLabel,
  formatMinutes,
  formatPercent,
  formatSiteTime,
} from '@/lib/field-data/format'
import type { FieldSnapshot, FieldSpace } from '@/lib/field-data/types'

/**
 * The public read of the operator analytics: the same datasets, the same
 * definitions, filtered the same way. Every figure is computed from the
 * sanitized snapshot — no stall IDs, no hardware identifiers, no location.
 */

type Tab = 'parking' | 'sensor'

type Dataset =
  | 'live'
  | 'events'
  | 'occupancy-rate'
  | 'dwell-time'
  | 'turnover'
  | 'vacancy-duration'
  | 'peak-demand'

const DATASETS: { id: Dataset; label: string; help: string }[] = [
  {
    id: 'live',
    label: 'Live occupancy',
    help: 'Which spaces are occupied or vacant right now, and whether each sensor is reporting.',
  },
  {
    id: 'events',
    label: 'Events',
    help: 'Recorded arrivals and departures. "Parked" means the sensor changed to occupied; "Left" means it changed to vacant.',
  },
  {
    id: 'occupancy-rate',
    label: 'Occupancy rate',
    help: 'The share of observed time a space had a vehicle in it.',
  },
  {
    id: 'dwell-time',
    label: 'Dwell time',
    help: 'How long a vehicle stayed. Only visits with both an arrival and a departure count toward the average.',
  },
  {
    id: 'turnover',
    label: 'Turnover',
    help: 'Completed visits per observed stall-day. Higher turnover means more vehicles used the space.',
  },
  {
    id: 'vacancy-duration',
    label: 'Vacancy duration',
    help: 'How long a space stayed empty between one vehicle leaving and the next arriving.',
  },
  {
    id: 'peak-demand',
    label: 'Peak demand',
    help: 'The hours when spaces were occupied most often. Taller bars mean a higher share of observed time was occupied.',
  },
]

function Table({
  columns,
  rows,
  empty,
}: {
  columns: string[]
  rows: React.ReactNode[][]
  empty: string
}) {
  if (rows.length === 0) {
    return <p className="py-6 text-[15px] leading-relaxed text-muted">{empty}</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] border-collapse text-left">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="border-b border-line pb-2 pr-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted last:pr-0"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  data-numeric
                  className="border-b border-line py-3 pr-4 text-[14px] text-ink last:pr-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function HourBars({ spaces }: { spaces: FieldSpace[] }) {
  const byHour = useMemo(() => {
    return Array.from({ length: 24 }, (_, hour) => {
      let occupied = 0
      let observed = 0
      for (const space of spaces) {
        const point = space.history.find((entry) => entry.hour === hour)
        if (!point || point.occupancyRate === null) continue
        occupied += point.occupancyRate * point.sampleMinutes
        observed += point.sampleMinutes
      }
      return observed > 0 ? occupied / observed : null
    })
  }, [spaces])

  const observed = byHour.filter((rate) => rate !== null)
  if (observed.length === 0) {
    return (
      <p className="py-6 text-[15px] leading-relaxed text-muted">
        Not enough observed time yet to describe the day by hour.
      </p>
    )
  }

  return (
    <figure className="m-0">
      <ul className="flex h-36 items-end gap-[2px] sm:gap-[3px]">
        {byHour.map((rate, hour) => (
          <li
            key={hour}
            className="flex h-full flex-1 items-end"
            aria-label={
              rate === null
                ? `${formatHourLabel(hour)}: no observed time`
                : `${formatHourLabel(hour)}: ${formatPercent(rate, 0)} occupied`
            }
          >
            {rate === null ? (
              <span aria-hidden="true" className="block h-[2px] w-full bg-line-strong" />
            ) : (
              <span
                aria-hidden="true"
                className="block w-full rounded-t-[1px] bg-brand transition-[height] duration-200 ease-out"
                style={{ height: `${Math.max(rate * 100, rate > 0 ? 2 : 0)}%` }}
              />
            )}
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="mt-2 flex gap-[2px] text-[11px] text-muted sm:gap-[3px]">
        {Array.from({ length: 24 }, (_, hour) => (
          <span key={hour} data-numeric className="flex-1 text-center">
            {hour % 6 === 0 ? formatHourLabel(hour) : ''}
          </span>
        ))}
      </div>
    </figure>
  )
}

export default function FieldAnalytics({
  snapshot,
  selectedKey,
  onSelect,
  interactionSource,
}: {
  snapshot: FieldSnapshot
  selectedKey: string
  onSelect: (key: string) => void
  interactionSource: 'validation_interaction' | 'platform_interaction'
}) {
  const [tab, setTab] = useState<Tab>('parking')
  const [dataset, setDataset] = useState<Dataset>('live')
  const [filter, setFilter] = useState<'all' | string>('all')

  const spaces = snapshot.spaces
  const shown = filter === 'all' ? spaces : spaces.filter((space) => space.key === filter)
  const tz = snapshot.site.timeZone
  const help = DATASETS.find((entry) => entry.id === dataset)?.help ?? ''

  function pickFilter(next: string) {
    setFilter(next)
    if (next !== 'all') onSelect(next)
    track(interactionSource, { control: 'analytics_filter' })
  }

  const parkingTable = () => {
    switch (dataset) {
      case 'live':
        return {
          columns: ['Space', 'Type', 'State', 'Sensor'],
          rows: shown.map((s) => [
            s.label,
            s.kind,
            s.state === 'OCCUPIED' ? 'Occupied' : s.state === 'VACANT' ? 'Vacant' : 'No reading',
            s.online ? 'Reporting' : 'Quiet',
          ]),
          empty: 'No spaces to show.',
        }
      case 'events': {
        const rows = shown
          .flatMap((s) => s.recentEvents.map((event) => ({ ...event, label: s.label })))
          .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
          .slice(0, 14)
          .map((event) => [
            event.label,
            event.state === 'OCCUPIED' ? 'Parked' : 'Left',
            formatSiteTime(event.at, tz),
          ])
        return {
          columns: ['Space', 'Event', 'Time'],
          rows,
          empty: 'No arrivals or departures recorded yet.',
        }
      }
      case 'occupancy-rate':
        return {
          columns: ['Space', 'Occupancy rate', 'Observed'],
          rows: shown.map((s) => [
            s.label,
            formatPercent(s.occupancyRate),
            formatMinutes(s.observedMinutes),
          ]),
          empty: 'No observed time yet.',
        }
      case 'dwell-time':
        return {
          columns: ['Space', 'Average dwell', 'Completed visits'],
          rows: shown.map((s) => [
            s.label,
            formatMinutes(s.meanDwellMinutes),
            formatCount(s.completedSessions),
          ]),
          empty: 'No completed visits yet.',
        }
      case 'turnover':
        return {
          columns: ['Space', 'Visits per day', 'Completed visits'],
          rows: shown.map((s) => [
            s.label,
            s.turnoverPerDay === null ? '—' : s.turnoverPerDay.toFixed(2),
            formatCount(s.completedSessions),
          ]),
          empty: 'No completed visits yet.',
        }
      case 'vacancy-duration':
        return {
          columns: ['Space', 'Average vacancy', 'Occupancy rate'],
          rows: shown.map((s) => [
            s.label,
            formatMinutes(s.meanVacancyMinutes),
            formatPercent(s.occupancyRate),
          ]),
          empty: 'No vacancy periods recorded yet.',
        }
      default:
        return { columns: [], rows: [], empty: '' }
    }
  }

  const sensorTable = {
    columns: ['Space', 'Connectivity', 'Battery', 'Signal', 'Events'],
    rows: shown.map((s) => [
      s.label,
      s.online ? 'Online' : 'Quiet',
      s.batteryVolts === null
        ? '—'
        : `${s.batteryVolts.toFixed(2)}V${s.batteryPercent === null ? '' : ` · ${s.batteryPercent}%`}`,
      s.signalDbm === null
        ? '—'
        : `${s.signalDbm} dBm${s.signalPercent === null ? '' : ` · ${s.signalPercent}%`}`,
      formatCount(s.totalEvents),
    ]),
    empty: 'No sensors reporting.',
  }

  const table = tab === 'parking' ? parkingTable() : sensorTable

  return (
    <div>
      {/* Primary tabs */}
      <div role="tablist" aria-label="Analytics" className="flex gap-1 border-b border-line">
        {(
          [
            ['parking', 'Parking analytics'],
            ['sensor', 'Sensor analytics'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => {
              setTab(id)
              track(interactionSource, { control: `tab_${id}` })
            }}
            className={`-mb-px border-b-2 px-4 py-3 text-[14px] font-semibold transition-colors duration-150 ${
              tab === id
                ? 'border-brand text-brand-strong'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dataset switcher and stall filter */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        {tab === 'parking' ? (
          <div className="flex flex-wrap gap-1.5">
            {DATASETS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                aria-pressed={dataset === entry.id}
                onClick={() => {
                  setDataset(entry.id)
                  track(interactionSource, { control: `dataset_${entry.id}` })
                }}
                className={`rounded border px-2.5 py-1.5 text-[13px] transition-colors duration-150 ${
                  dataset === entry.id
                    ? 'border-brand bg-brand-tint font-medium text-brand-strong'
                    : 'border-line text-muted hover:border-line-strong hover:text-ink'
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>
        ) : null}

        <label className="ml-auto flex items-center gap-2 text-[13px] text-muted">
          Space
          <select
            value={filter}
            onChange={(event) => pickFilter(event.target.value)}
            className="rounded border border-line-strong bg-white px-2.5 py-1.5 text-[13px] text-ink"
          >
            <option value="all">All spaces</option>
            {spaces.map((space) => (
              <option key={space.key} value={space.key}>
                {space.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {tab === 'parking' && help ? (
        <p className="measure-wide mt-4 text-[14px] leading-relaxed text-muted">{help}</p>
      ) : null}

      <div className="mt-5">
        {tab === 'parking' && dataset === 'peak-demand' ? (
          <HourBars spaces={shown} />
        ) : (
          <Table columns={table.columns} rows={table.rows} empty={table.empty} />
        )}
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-muted">
        Figures cover the observed window at the field site. Nothing here identifies the
        location or the hardware.
      </p>

      {/* Keeps the diagram selection and the filter in step. */}
      <span className="sr-only" aria-live="polite">
        Showing {filter === 'all' ? 'all spaces' : (spaces.find((s) => s.key === selectedKey)?.label ?? '')}
      </span>
    </div>
  )
}

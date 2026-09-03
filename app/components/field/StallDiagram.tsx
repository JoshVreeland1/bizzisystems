'use client'

import type { FieldSpace } from '@/lib/field-data/types'

/**
 * The monitored spaces drawn to their real arrangement: a row of stalls along
 * one curb, each with its sensor at the curb edge.
 *
 * Deliberately not a map. A map needs coordinates, and coordinates would give
 * away the field site this data is anonymized to protect. A diagram carries the
 * spatial relationship an operator actually reads — which stall, which
 * neighbour, which sensor — with no geography attached.
 */

const FILL: Record<string, string> = {
  OCCUPIED: 'bg-occupied-tint border-occupied/35',
  VACANT: 'bg-vacant-tint border-vacant/35',
  UNKNOWN: 'bg-surface-2 border-line',
}

const DOT: Record<string, string> = {
  OCCUPIED: 'bg-occupied',
  VACANT: 'bg-vacant',
  UNKNOWN: 'bg-muted',
}

const WORD: Record<string, string> = {
  OCCUPIED: 'Occupied',
  VACANT: 'Vacant',
  UNKNOWN: 'No reading',
}

export default function StallDiagram({
  spaces,
  selectedKey,
  onSelect,
}: {
  spaces: FieldSpace[]
  selectedKey: string
  onSelect: (key: string) => void
}) {
  return (
    <div>
      <div
        role="group"
        aria-label="Monitored parking spaces"
        className="flex items-stretch gap-2 sm:gap-3"
      >
        {spaces.map((space) => {
          const selected = space.key === selectedKey
          return (
            <button
              key={space.key}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(space.key)}
              className={`group relative flex flex-1 flex-col justify-between rounded-t-md border-2 border-b-0 px-2 pb-5 pt-3 text-left transition-all duration-150 sm:px-3 sm:pt-4 ${
                FILL[space.state]
              } ${
                selected
                  ? 'ring-2 ring-brand ring-offset-2'
                  : 'opacity-90 hover:opacity-100'
              }`}
              style={{ minHeight: '9rem' }}
            >
              <span>
                <span className="block text-[14px] font-semibold text-ink sm:text-[15px]">
                  {space.label}
                </span>
                <span className="mt-0.5 block text-[11px] uppercase tracking-[0.08em] text-muted sm:text-[12px]">
                  {space.kind}
                </span>
              </span>

              <span className="mt-3 block">
                <span className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 rounded-full ${DOT[space.state]}`}
                  />
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-[0.06em] sm:text-[12px] ${
                      space.state === 'OCCUPIED'
                        ? 'text-occupied'
                        : space.state === 'VACANT'
                          ? 'text-vacant'
                          : 'text-muted'
                    }`}
                  >
                    {WORD[space.state]}
                  </span>
                </span>
                {space.occupancyRate !== null ? (
                  <span data-numeric className="mt-1 block text-[11px] text-muted">
                    {Math.round(space.occupancyRate * 100)}% occupied
                  </span>
                ) : null}
              </span>

              {/* The sensor, sitting at the curb edge of its own stall. */}
              <span
                aria-hidden="true"
                title="Sensor"
                className={`absolute -bottom-[7px] left-1/2 h-[10px] w-[26px] -translate-x-1/2 rounded-sm border ${
                  space.online
                    ? 'border-navy/25 bg-navy'
                    : 'border-line-strong bg-surface-2'
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* The curb the sensors are bonded to. */}
      <div aria-hidden="true" className="h-[6px] w-full rounded-sm bg-line-strong" />
      <p aria-hidden="true" className="mt-2 text-[11px] uppercase tracking-[0.12em] text-muted">
        Curb
      </p>
    </div>
  )
}

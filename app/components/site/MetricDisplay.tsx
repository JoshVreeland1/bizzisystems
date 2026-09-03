import type { ReactNode } from 'react'

export interface Metric {
  label: string
  value: string
  /** Sample size, denominator or unit. Always shown when a rate is shown. */
  note?: string
}

/**
 * A measured value and the thing it was measured against, in that order.
 * Rendered as a definition group so the label and number stay associated;
 * metrics sit on an open ruled row rather than in cards.
 */
export function MetricDisplay({
  metric,
  size = 'md',
  onDark = false,
}: {
  metric: Metric
  size?: 'sm' | 'md'
  onDark?: boolean
}) {
  return (
    <div>
      {/* Two lines are reserved so a label that wraps cannot push its own
          number out of line with the rest of the row. */}
      <dt
        className={`min-h-[2.4em] text-[11px] font-semibold uppercase leading-[1.2] tracking-[0.12em] ${
          onDark ? 'text-muted-on-dark' : 'text-muted'
        }`}
      >
        {metric.label}
      </dt>
      <dd className="mt-2">
        <span
          data-numeric
          className={`block font-semibold tracking-[-0.02em] ${
            size === 'sm' ? 'text-[24px]' : 'text-[30px] md:text-[36px]'
          } ${onDark ? 'text-white' : 'text-ink'}`}
        >
          {metric.value}
        </span>
        {metric.note ? (
          <span
            className={`mt-1.5 block text-[13px] leading-snug ${
              onDark ? 'text-muted-on-dark' : 'text-muted'
            }`}
          >
            {metric.note}
          </span>
        ) : null}
      </dd>
    </div>
  )
}

export function MetricRow({
  metrics,
  onDark = false,
  size = 'md',
  columns = 4,
}: {
  metrics: Metric[]
  onDark?: boolean
  size?: 'sm' | 'md'
  columns?: 3 | 4 | 5
}) {
  const gridClass =
    columns === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : columns === 5
        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
        : 'grid-cols-2 lg:grid-cols-4'

  return (
    <dl className={`grid gap-x-6 gap-y-9 ${gridClass}`}>
      {metrics.map((metric) => (
        <MetricDisplay key={metric.label} metric={metric} size={size} onDark={onDark} />
      ))}
    </dl>
  )
}

/** Status word plus dot. The word carries the meaning; the dot only echoes it. */
export function StatusPill({
  tone,
  children,
}: {
  tone: 'occupied' | 'vacant' | 'unknown'
  children: ReactNode
}) {
  const styles = {
    occupied: 'bg-occupied-tint text-occupied',
    vacant: 'bg-vacant-tint text-vacant',
    unknown: 'bg-surface-2 text-muted',
  }[tone]

  const dot = {
    occupied: 'bg-occupied',
    vacant: 'bg-vacant',
    unknown: 'bg-muted',
  }[tone]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[12px] font-semibold uppercase tracking-[0.06em] ${styles}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {children}
    </span>
  )
}

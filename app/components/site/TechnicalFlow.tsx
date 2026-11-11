export interface FlowStep {
  label: string
  detail?: string
}

/**
 * A sequence of stages drawn as a collapsed-border grid: adjacent cells share
 * one hairline, so the whole thing reads as a single ruled table of stages
 * rather than a row of floating cards. Numbering carries the order, which is
 * why no arrows are needed when it stacks on a phone.
 */
export function TechnicalFlow({
  steps,
  onDark = false,
  ariaLabel,
  columns = 3,
}: {
  steps: FlowStep[]
  onDark?: boolean
  ariaLabel: string
  columns?: 2 | 3 | 5
}) {
  const tone = onDark
    ? 'border-line-on-dark text-white'
    : 'border-line text-ink'
  const detailTone = onDark ? 'text-muted-on-dark' : 'text-muted'
  const grid =
    columns === 2
      ? 'sm:grid-cols-2'
      : columns === 5
        ? 'sm:grid-cols-2 lg:grid-cols-5'
        : 'sm:grid-cols-2 lg:grid-cols-3'

  return (
    <ol aria-label={ariaLabel} className={`grid ${grid}`}>
      {steps.map((step, index) => (
        <li
          key={step.label}
          className={`-mt-px border-t px-0 py-6 sm:-ml-px sm:mt-0 sm:border-l sm:border-t-0 sm:px-5 sm:py-5 ${tone}`}
        >
          <span
            data-numeric
            className={`text-[11px] font-semibold tracking-[0.12em] ${
              onDark ? 'text-brand-on-dark' : 'text-brand-strong'
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="mt-2 text-[16px] font-medium leading-snug">{step.label}</p>
          {step.detail ? (
            <p className={`mt-2 max-w-xs text-[14px] leading-relaxed ${detailTone}`}>
              {step.detail}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

/**
 * A single-file sequence of short states, used for the bay dwell record.
 */
export function StateSequence({
  steps,
  ariaLabel,
}: {
  steps: { state: string; note: string }[]
  ariaLabel: string
}) {
  return (
    <ol aria-label={ariaLabel} className="relative">
      {steps.map((step, index) => (
        <li key={step.state} className="relative flex gap-5 pb-7 last:pb-0">
          <span aria-hidden="true" className="relative flex w-3 shrink-0 justify-center">
            <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-brand bg-white" />
            {index < steps.length - 1 ? (
              <span className="absolute top-5 h-[calc(100%-0.5rem)] w-px bg-line-strong" />
            ) : null}
          </span>
          <div className="-mt-1">
            <p className="text-[15px] font-medium uppercase tracking-[0.06em] text-ink">
              {step.state}
            </p>
            <p className="mt-1 max-w-md text-[14px] leading-relaxed text-muted">{step.note}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

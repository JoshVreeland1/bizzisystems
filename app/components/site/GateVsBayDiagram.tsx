/**
 * Gate record versus bay record, drawn against one shared clock.
 *
 * The times are a labelled illustration of what each system captures, not a
 * measurement from any deployment: Bizzi has no warehouse field data yet.
 *
 * Two presentations of the same figure rather than one that shrinks. Below the
 * sm breakpoint the drawing would need horizontal scrolling and 8px labels, so
 * a stacked version carries the same proportions with readable type instead.
 */

const SEGMENTS = [
  { label: 'Yard', share: 22.4, occupied: false },
  { label: 'Bay occupied', share: 50, occupied: true },
  { label: 'Yard', share: 27.6, occupied: false },
]

const CAPTION =
  'Illustration, not measured data. A gate timestamp brackets the whole visit. The question an operations team usually has to answer is the shorter span in the middle of it.'

const ARIA =
  'A gate system records one span from arrival at the facility to departure, three hours and twenty minutes. A bay sensor records a shorter span inside it, one hour and forty-eight minutes, when the monitored bay itself was occupied, with yard time on either side.'

function StackedVersion() {
  return (
    <div className="sm:hidden" role="img" aria-label={ARIA}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
        Gate system
      </p>
      <div className="mt-2 h-7 w-full border border-line-strong bg-surface-2" />
      <p className="mt-2 text-[14px] text-ink" data-numeric>
        On site — 3h 20m
      </p>

      <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
        Bay sensor
      </p>
      <div className="mt-2 flex h-7 w-full">
        {SEGMENTS.map((segment, index) => (
          <div
            key={`${segment.label}-${index}`}
            style={{ width: `${segment.share}%` }}
            className={
              segment.occupied
                ? 'flex items-center justify-center bg-brand'
                : 'border border-line bg-surface'
            }
          >
            {segment.occupied ? null : (
              <span className="sr-only">{segment.label}</span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[14px] text-ink" data-numeric>
        Bay occupied — 1h 48m
        <span className="text-muted"> · yard time either side</span>
      </p>
    </div>
  )
}

function DrawnVersion() {
  const marks = [
    { x: 60, label: '9a' },
    { x: 220, label: '10a' },
    { x: 380, label: '11a' },
    { x: 540, label: '12p' },
    { x: 660, label: '1p' },
  ]

  return (
    <svg
      viewBox="0 0 720 216"
      className="hidden h-auto w-full sm:block"
      role="img"
      aria-label={ARIA}
    >
      <line x1="40" y1="182" x2="700" y2="182" stroke="#C2CDDC" strokeWidth="1" />
      {marks.map((mark) => (
        <g key={mark.label}>
          <line x1={mark.x} y1="178" x2={mark.x} y2="186" stroke="#C2CDDC" strokeWidth="1" />
          <text
            x={mark.x}
            y="204"
            textAnchor="middle"
            fill="#566681"
            fontSize="12"
            fontFamily="inherit"
          >
            {mark.label}
          </text>
        </g>
      ))}

      <text x="40" y="30" fill="#566681" fontSize="12" fontFamily="inherit" letterSpacing="0.08em">
        GATE SYSTEM
      </text>
      <rect x="60" y="44" width="580" height="26" fill="#EBEFF6" stroke="#C2CDDC" />
      <text x="350" y="61" textAnchor="middle" fill="#101B2D" fontSize="13" fontFamily="inherit">
        On site — 3h 20m
      </text>

      <text x="40" y="112" fill="#566681" fontSize="12" fontFamily="inherit" letterSpacing="0.08em">
        BAY SENSOR
      </text>
      <rect x="60" y="126" width="130" height="26" fill="#F5F7FA" stroke="#DCE3ED" />
      <text x="125" y="143" textAnchor="middle" fill="#566681" fontSize="12" fontFamily="inherit">
        Yard
      </text>

      <rect x="190" y="126" width="290" height="26" fill="#2F6BFF" />
      <text x="335" y="143" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontFamily="inherit">
        Bay occupied — 1h 48m
      </text>

      <rect x="480" y="126" width="160" height="26" fill="#F5F7FA" stroke="#DCE3ED" />
      <text x="560" y="143" textAnchor="middle" fill="#566681" fontSize="12" fontFamily="inherit">
        Yard
      </text>

      <line x1="190" y1="152" x2="190" y2="182" stroke="#2F6BFF" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="480" y1="152" x2="480" y2="182" stroke="#2F6BFF" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  )
}

export default function GateVsBayDiagram() {
  return (
    <figure className="m-0 min-w-0">
      <StackedVersion />
      <DrawnVersion />
      <figcaption className="mt-5 border-l-2 border-line-strong pl-3 text-[13px] leading-relaxed text-muted">
        {CAPTION}
      </figcaption>
    </figure>
  )
}

import type { ReactNode } from 'react'

/**
 * The site's one horizontal rhythm: a 1200px measure with 24px gutters that
 * open to 40px from the tablet breakpoint up. Every section uses it, so
 * headlines, rules, images and data all land on the same left edge.
 */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-6 md:px-10 ${className}`}>
      {children}
    </div>
  )
}

type Tone = 'white' | 'surface' | 'navy'

const TONE_CLASS: Record<Tone, string> = {
  white: 'bg-white text-ink',
  surface: 'bg-surface text-ink',
  navy: 'bg-navy text-white',
}

/** Vertical rhythm. `divide` draws the hairline that separates light sections. */
export function Section({
  children,
  tone = 'white',
  divide = false,
  id,
  className = '',
  labelledBy,
}: {
  children: ReactNode
  tone?: Tone
  divide?: boolean
  id?: string
  className?: string
  labelledBy?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${TONE_CLASS[tone]} ${
        divide ? 'border-t border-line' : ''
      } py-16 md:py-24 lg:py-28 ${className}`}
    >
      <Container>{children}</Container>
    </section>
  )
}

/**
 * Small uppercase label used to head a section without inventing another
 * heading level. Set as a rule-and-label pair, not a floating pill.
 */
export function Eyebrow({
  children,
  onDark = false,
}: {
  children: ReactNode
  onDark?: boolean
}) {
  return (
    <p
      className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
        onDark ? 'text-brand-on-dark' : 'text-brand-strong'
      }`}
    >
      {children}
    </p>
  )
}

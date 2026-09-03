import type { ReactNode } from 'react'
import { Container, Eyebrow } from './Container'

/**
 * Interior-page masthead: the title holds the left half, the standfirst the
 * right, set to the same bottom edge. A single left-aligned column at these
 * sizes leaves half the grid empty and reads as an unfinished page.
 */
export default function PageHeader({
  eyebrow,
  title,
  lead,
  note,
}: {
  eyebrow: string
  title: ReactNode
  lead: ReactNode
  note?: ReactNode
}) {
  return (
    <section className="border-b border-line bg-white">
      <Container>
        <div className="grid gap-8 py-14 md:py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-6">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-4 text-[34px] sm:text-[42px] lg:text-[48px]">{title}</h1>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:self-end lg:pb-1">
            <p className="text-[17px] leading-relaxed text-muted md:text-[18px]">{lead}</p>
            {note ? (
              <p className="mt-5 border-l-2 border-brand pl-5 text-[15px] leading-relaxed text-muted">
                {note}
              </p>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}

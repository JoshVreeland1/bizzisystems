import { Container } from './Container'
import { PrimaryCta, SecondaryCta } from './Cta'

/**
 * Closing band. Every page ends here, which is the point: one action, stated
 * the same way, after whatever argument the page just made.
 */
export default function MeetingCta({
  heading = 'Tell us what you need to measure.',
  body,
  source,
  secondary,
}: {
  heading?: string
  body: string
  source: string
  secondary?: { href: string; label: string }
}) {
  return (
    // A page that ends on a dark section would otherwise merge into this one.
    <section className="border-t border-line-on-dark bg-navy text-white">
      <Container>
        <div className="grid gap-8 py-16 md:grid-cols-12 md:items-end md:py-20">
          <div className="md:col-span-7">
            <h2 className="text-[28px] md:text-[34px]">{heading}</h2>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted-on-dark">
              {body}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 md:col-span-5 md:justify-end">
            <PrimaryCta size="lg" variant="onDark" source={source} />
            {secondary ? (
              <SecondaryCta href={secondary.href} onDark>
                {secondary.label}
              </SecondaryCta>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}

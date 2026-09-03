import Link from 'next/link'
import { Container } from './components/site/Container'
import { PrimaryCta } from './components/site/Cta'

export default function NotFound() {
  return (
    <Container>
      <div className="max-w-xl py-24 md:py-32">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-strong">
          404
        </p>
        <h1 className="mt-4 text-[34px] sm:text-[40px]">That page is not here.</h1>
        <p className="mt-5 text-[17px] leading-relaxed text-muted">
          It may have moved during the site rebuild. The pages below cover everything.
        </p>
        <ul className="mt-8 border-t border-line">
          {[
            ['Platform', '/platform'],
            ['Cities', '/cities'],
            ['Warehouses', '/warehouses'],
            ['Validation', '/validation'],
            ['Team', '/team'],
          ].map(([label, href]) => (
            <li key={href} className="border-b border-line">
              <Link
                href={href}
                className="block py-4 text-[17px] font-medium text-ink transition-colors duration-150 hover:text-brand-strong"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-9">
          <PrimaryCta size="lg" source="not_found" />
        </div>
      </div>
    </Container>
  )
}

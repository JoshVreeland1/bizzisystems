import Image from 'next/image'
import Link from 'next/link'
import { Container } from './Container'
import { COMPANY_ADDRESS } from '@/lib/site'

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'Platform', href: '/platform' },
      { label: 'Validation', href: '/validation' },
    ],
  },
  {
    heading: 'Markets',
    links: [
      { label: 'Cities', href: '/cities' },
      { label: 'Warehouses', href: '/warehouses' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Team', href: '/team' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Bizzi Systems — home">
              <Image src="/logo-mark.png" alt="" width={256} height={256} className="h-7 w-7" />
              <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink">
                Bizzi Systems
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted">
              Per-space occupancy and dwell data for parking and logistics operations.
            </p>
            <address className="mt-5 not-italic text-[13px] leading-relaxed text-muted">
              {COMPANY_ADDRESS.street}
              <br />
              Austin, Texas {COMPANY_ADDRESS.postalCode}
            </address>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading} className="md:col-span-2">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-ink transition-colors duration-150 hover:text-brand-strong"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-1" />
        </div>

        <div className="border-t border-line py-6 text-[13px] text-muted">
          <p>&copy; {new Date().getFullYear()} Bizzi Systems, Inc.</p>
        </div>
      </Container>
    </footer>
  )
}

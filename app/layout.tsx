import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import './globals.css'
import Header from './components/site/Header'
import Footer from './components/site/Footer'
import {
  COMPANY_ADDRESS,
  HOME_DESCRIPTION,
  HOME_TITLE,
  HOME_URL,
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_URL,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site'

const plex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: HOME_URL },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: HOME_URL,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    locale: 'en_US',
    images: [
      {
        url: SOCIAL_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: SOCIAL_IMAGE_ALT,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: SOCIAL_IMAGE_URL, alt: SOCIAL_IMAGE_ALT }],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Bizzi Systems, Inc.',
  url: HOME_URL,
  logo: `${SITE_URL}/logo-mark.png`,
  description: HOME_DESCRIPTION,
  foundingDate: '2026',
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY_ADDRESS.street,
    addressLocality: COMPANY_ADDRESS.locality,
    addressRegion: COMPANY_ADDRESS.region,
    postalCode: COMPANY_ADDRESS.postalCode,
    addressCountry: COMPANY_ADDRESS.country,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'josh@bizzisystems.com',
    areaServed: 'US',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plex.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-[14px] focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          // Static, author-controlled object. No user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
        />
      </body>
    </html>
  )
}

import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import sitemap from '@/app/sitemap'
import robots from '@/app/robots'
import {
  createPageMetadata,
  HOME_DESCRIPTION,
  HOME_TITLE,
  HOME_URL,
  NAV,
  SOCIAL_IMAGE_URL,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site'

interface RedirectRule {
  source: string
  destination: string
  permanent: boolean
}

// next.config.js is plain CommonJS with no types of its own.
const nextConfig = require('../next.config.js') as {
  redirects: () => Promise<RedirectRule[]>
}

const ROUTES = [
  '/',
  '/platform',
  '/cities',
  '/warehouses',
  '/validation',
  '/team',
  '/contact',
  '/privacy',
]

describe('sitemap', () => {
  const entries = sitemap()
  const urls = entries.map((entry) => entry.url)

  it('lists every public route exactly once', () => {
    const expected = ROUTES.map((route) => (route === '/' ? HOME_URL : `${SITE_URL}${route}`))
    expect([...urls].sort()).toEqual([...expected].sort())
  })

  it('lists no retired or private route', () => {
    for (const gone of ['/company', '/investors', '/waitlist', '/terms', '/api']) {
      expect(urls.some((url) => url.endsWith(gone))).toBe(false)
    }
  })

  it('uses absolute canonical URLs', () => {
    for (const url of urls) expect(url.startsWith(SITE_URL)).toBe(true)
  })
})

describe('canonical and social metadata', () => {
  it('uses the non-www Bizzi domain as the one canonical origin', () => {
    expect(SITE_URL).toBe('https://bizzisystems.com')
    expect(HOME_URL).toBe('https://bizzisystems.com/')
  })

  it('keeps homepage canonical and Open Graph fields aligned', () => {
    const metadata = createPageMetadata({
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      path: '/',
    })

    expect(metadata.alternates?.canonical).toBe(HOME_URL)
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      siteName: SITE_NAME,
      url: HOME_URL,
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      images: [{ url: SOCIAL_IMAGE_URL, width: 1200, height: 630 }],
    })
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      images: [{ url: SOCIAL_IMAGE_URL }],
    })
  })

  it('contains no www canonical override in metadata sources', () => {
    const files = [
      'lib/site.ts',
      'app/layout.tsx',
      'app/page.tsx',
      'app/robots.ts',
      'app/sitemap.ts',
      'app/opengraph-image.tsx',
      'next.config.js',
    ]
    const source = files.map((file) => readFileSync(file, 'utf8')).join('\n')

    expect(source).not.toContain('www.bizzisystems.com')
  })
})

describe('robots', () => {
  const result = robots()

  it('allows the site and keeps crawlers out of the API', () => {
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules
    expect(rule.allow).toBe('/')
    expect(rule.disallow).toBe('/api/')
  })

  it('points at the sitemap', () => {
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
  })
})

describe('redirects', () => {
  it('sends every retired route somewhere useful, permanently', async () => {
    const redirects = await nextConfig.redirects()
    const map = Object.fromEntries(redirects.map((rule) => [rule.source, rule]))

    expect(map['/company'].destination).toBe('/team')
    expect(map['/investors'].destination).toBe('/team')
    expect(map['/waitlist'].destination).toBe('/contact')
    expect(map['/universities'].destination).toBe('/cities')
    expect(map['/terms'].destination).toBe('/privacy')

    for (const redirect of redirects) expect(redirect.permanent).toBe(true)
  })

  it('does not redirect a route that still exists', async () => {
    const redirects = await nextConfig.redirects()
    const sources = redirects.map((rule) => rule.source)
    for (const route of ROUTES) expect(sources).not.toContain(route)
  })
})

describe('navigation', () => {
  it('points only at routes that exist', () => {
    const targets = NAV.flatMap((item) =>
      item.children ? item.children.map((child) => child.href) : [item.href]
    )
    for (const target of targets) expect(ROUTES).toContain(target)
  })

  it('offers cities and warehouses as the only markets', () => {
    const markets = NAV.find((item) => item.children)
    expect(markets?.children?.map((child) => child.label)).toEqual(['Cities', 'Warehouses'])
  })

  it('has no investor or universities entry', () => {
    const labels = NAV.flatMap((item) => [
      item.label,
      ...(item.children?.map((child) => child.label) ?? []),
    ])
    expect(labels).not.toContain('Investors')
    expect(labels).not.toContain('Universities')
  })
})

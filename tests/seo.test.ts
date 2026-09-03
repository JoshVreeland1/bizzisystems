import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import robots from '@/app/robots'
import { NAV, SITE_URL } from '@/lib/site'

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
    const expected = ROUTES.map((route) => (route === '/' ? SITE_URL : `${SITE_URL}${route}`))
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

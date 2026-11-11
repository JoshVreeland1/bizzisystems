import { afterEach, describe, expect, it, vi } from 'vitest'

describe('deployment inquiry', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('still succeeds when the saved submission’s email notification fails', async () => {
    vi.stubEnv('SITE_SUPABASE_URL', 'https://db.example')
    vi.stubEnv('SITE_SUPABASE_ANON_KEY', 'anon')
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('INQUIRY_NOTIFY_EMAIL', 'ops@example.com')
    const fetchMock = vi.fn(async (url: string) => {
      if (url.startsWith('https://api.resend.com')) throw new Error('resend down')
      return new Response(null, { status: 201 })
    })
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const { POST } = await import('../app/api/deployment-inquiry/route')
    const { MARKETS, SPACE_COUNTS } = await import('../lib/contact-options')
    const request = new Request('http://localhost/api/deployment-inquiry', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Ada',
        email: 'ada@example.com',
        organization: 'Example Co',
        market: MARKETS[0],
        size: SPACE_COUNTS[0],
      }),
    })

    const response = await POST(request as never)
    expect(response.status).toBe(200)
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      'https://db.example/rest/v1/deployment_inquiries',
      'https://api.resend.com/emails',
    ])
  })
})

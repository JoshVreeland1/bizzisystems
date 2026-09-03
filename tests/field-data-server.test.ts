import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const URL_KEY = 'BIZZI_FIELD_SUPABASE_URL'
const KEY_KEY = 'BIZZI_FIELD_ANON_KEY'

async function loadServer() {
  vi.resetModules()
  return import('@/lib/field-data/server')
}

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response
}

describe('getFieldSnapshot', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('reports unconfigured when no credentials are present', async () => {
    vi.stubEnv(URL_KEY, '')
    vi.stubEnv(KEY_KEY, '')
    const { getFieldSnapshot, isFieldDataConfigured } = await loadServer()

    expect(isFieldDataConfigured()).toBe(false)
    expect(await getFieldSnapshot()).toEqual({ state: 'unconfigured' })
  })

  it('never sends a request when only one credential is set', async () => {
    vi.stubEnv(URL_KEY, 'https://example.supabase.co')
    vi.stubEnv(KEY_KEY, '')
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    const { getFieldSnapshot } = await loadServer()
    expect(await getFieldSnapshot()).toEqual({ state: 'unconfigured' })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('reports unpublished when no site has been allowlisted', async () => {
    vi.stubEnv(URL_KEY, 'https://example.supabase.co')
    vi.stubEnv(KEY_KEY, 'anon-key')
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ published: false })))

    const { getFieldSnapshot } = await loadServer()
    expect(await getFieldSnapshot()).toEqual({ state: 'unpublished' })
  })

  it('reports unavailable on a non-2xx response', async () => {
    vi.stubEnv(URL_KEY, 'https://example.supabase.co')
    vi.stubEnv(KEY_KEY, 'anon-key')
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({}, 500)))

    const { getFieldSnapshot } = await loadServer()
    expect(await getFieldSnapshot()).toEqual({ state: 'unavailable' })
  })

  it('reports unavailable when the request throws', async () => {
    vi.stubEnv(URL_KEY, 'https://example.supabase.co')
    vi.stubEnv(KEY_KEY, 'anon-key')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('timed out')
      })
    )

    const { getFieldSnapshot } = await loadServer()
    expect(await getFieldSnapshot()).toEqual({ state: 'unavailable' })
  })

  it('reports unavailable rather than half-rendering a malformed payload', async () => {
    vi.stubEnv(URL_KEY, 'https://example.supabase.co')
    vi.stubEnv(KEY_KEY, 'anon-key')
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ published: true, spaces: 'oops' })))

    const { getFieldSnapshot } = await loadServer()
    expect(await getFieldSnapshot()).toEqual({ state: 'unavailable' })
  })

  it('sends the anon key and never a service-role header', async () => {
    vi.stubEnv(URL_KEY, 'https://example.supabase.co/')
    vi.stubEnv(KEY_KEY, 'anon-key')
    const fetchSpy = vi.fn(async () => jsonResponse({ published: false }))
    vi.stubGlobal('fetch', fetchSpy)

    const { getFieldSnapshot } = await loadServer()
    await getFieldSnapshot()

    const [url, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://example.supabase.co/rest/v1/rpc/public_field_snapshot')
    expect(init.method).toBe('POST')

    const headers = init.headers as Record<string, string>
    expect(headers.apikey).toBe('anon-key')
    expect(headers.Authorization).toBe('Bearer anon-key')
    expect(JSON.stringify(headers).toLowerCase()).not.toContain('service')
  })

  it('returns a parsed snapshot on a healthy read', async () => {
    vi.stubEnv(URL_KEY, 'https://example.supabase.co')
    vi.stubEnv(KEY_KEY, 'anon-key')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse({
          published: true,
          generated_at: new Date().toISOString(),
          window_days: 7,
          site: { name: 'Honest Mary’s', city: 'Austin, Texas', time_zone: 'America/Chicago' },
          spaces_monitored: 3,
          spaces_online: 3,
          occupancy_events: 103,
          last_event_at: new Date().toISOString(),
          accuracy: { check_ins: 0, validated_observations: 0, matches: 0, mismatches: 0 },
          spaces: [{ label: 'Space 1', kind: 'Regular', state: 'VACANT', online: true }],
        })
      )
    )

    const { getFieldSnapshot } = await loadServer()
    const result = await getFieldSnapshot()

    expect(result.state).toBe('ok')
    if (result.state === 'ok') {
      expect(result.snapshot.spaces).toHaveLength(1)
      expect(result.snapshot.accuracy.accuracyPercent).toBeNull()
      expect(result.snapshot.stale).toBe(false)
    }
  })
})

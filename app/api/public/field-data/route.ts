import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getFieldSnapshot, SNAPSHOT_REVALIDATE_SECONDS } from '@/lib/field-data/server'

/**
 * Read-only public field data.
 *
 * Only GET is exported, so every other method is a 405 from the router. There
 * is no public mutation path to the pilot database anywhere in this app.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 30
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(key: string, now: number): boolean {
  const existing = hits.get(key)

  if (!existing || existing.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    // Opportunistic sweep so the map cannot grow without bound.
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k)
    }
    return false
  }

  existing.count += 1
  return existing.count > MAX_REQUESTS_PER_WINDOW
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

export async function GET(request: NextRequest) {
  if (rateLimited(clientKey(request), Date.now())) {
    return NextResponse.json(
      { state: 'unavailable' },
      { status: 429, headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' } }
    )
  }

  const result = await getFieldSnapshot()

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': `public, s-maxage=${SNAPSHOT_REVALIDATE_SECONDS}, stale-while-revalidate=300`,
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

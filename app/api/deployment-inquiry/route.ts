import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { MARKETS, SPACE_COUNTS } from '@/lib/contact-options'

/**
 * Qualification details captured immediately before a meeting is booked.
 *
 * Deliberately short: market, organization, rough size, contact and an optional
 * note. Nothing here is used for tracking, and no third-party pixel sees it.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Bizzi runs a single Supabase project, so this falls back to the same project
 * the field feed reads from. Setting SITE_SUPABASE_* splits form submissions
 * into their own project later without touching this file.
 *
 * The anon key can only INSERT into deployment_inquiries: the table grants no
 * SELECT to anon and carries no read policy, so a submission cannot be read
 * back with the same key it was written with.
 */
const SUPABASE_URL =
  process.env.SITE_SUPABASE_URL ??
  process.env.BIZZI_FIELD_SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  ''
const SUPABASE_ANON_KEY =
  process.env.SITE_SUPABASE_ANON_KEY ??
  process.env.BIZZI_FIELD_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  ''

const LIMITS = { name: 120, email: 200, organization: 160, note: 2000 }

const WINDOW_MS = 10 * 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(key: string, now: number): boolean {
  const existing = hits.get(key)
  if (!existing || existing.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k)
    }
    return false
  }
  existing.count += 1
  return existing.count > MAX_PER_WINDOW
}

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

function fail(field: string, message: string) {
  return NextResponse.json({ error: message, field }, { status: 400 })
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  if (rateLimited(ip, Date.now())) {
    return NextResponse.json(
      { error: 'Too many submissions. Try again in a few minutes.' },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Could not read that submission.' }, { status: 400 })
  }

  // Bots fill every field they find. People never see this one.
  if (clean(body.company_website, 200) !== '') {
    return NextResponse.json({ ok: true })
  }

  const name = clean(body.name, LIMITS.name)
  const email = clean(body.email, LIMITS.email).toLowerCase()
  const organization = clean(body.organization, LIMITS.organization)
  const note = clean(body.note, LIMITS.note)
  const market = clean(body.market, 60)
  const size = clean(body.size, 40)

  if (!name) return fail('name', 'Add your name so we know who we are meeting.')
  if (!isEmail(email)) return fail('email', 'Enter an email address we can reply to.')
  if (!organization) return fail('organization', 'Add the organization you work for.')
  if (!(MARKETS as readonly string[]).includes(market)) {
    return fail('market', 'Choose the option closest to your situation.')
  }
  if (!(SPACE_COUNTS as readonly string[]).includes(size)) {
    return fail('size', 'Pick an approximate number of spaces.')
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('[deployment-inquiry] Supabase is not configured for this environment.')
    return NextResponse.json(
      { error: 'We could not record that just now. Email josh@bizzisystems.com instead.' },
      { status: 503 }
    )
  }

  try {
    const response = await fetch(`${SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/deployment_inquiries`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name,
        email,
        organization,
        market,
        approximate_spaces: size,
        note: note || null,
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      console.error('[deployment-inquiry] insert failed with status', response.status)
      return NextResponse.json(
        { error: 'We could not record that just now. Email josh@bizzisystems.com instead.' },
        { status: 502 }
      )
    }
  } catch (error) {
    console.error('[deployment-inquiry] insert threw:', error)
    return NextResponse.json(
      { error: 'We could not record that just now. Email josh@bizzisystems.com instead.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}

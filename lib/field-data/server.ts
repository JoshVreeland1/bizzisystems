import { parseSnapshot } from './parse'
import type { FieldDataResult } from './types'

/**
 * Server-only reader for the public field snapshot.
 *
 * Neither variable is NEXT_PUBLIC_, so no credential reaches the browser even
 * by accident. The site talks to one SECURITY DEFINER RPC that returns an
 * already-sanitized document; it has no access to pilot tables, no write path,
 * and no service-role key anywhere in the request.
 */
const SUPABASE_URL = process.env.BIZZI_FIELD_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = process.env.BIZZI_FIELD_ANON_KEY ?? ''

/** Seconds the snapshot is reused before the next origin read. */
export const SNAPSHOT_REVALIDATE_SECONDS = 60

const REQUEST_TIMEOUT_MS = 6000

export function isFieldDataConfigured(): boolean {
  return SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== ''
}

export async function getFieldSnapshot(): Promise<FieldDataResult> {
  if (!isFieldDataConfigured()) return { state: 'unconfigured' }

  let payload: unknown
  try {
    const response = await fetch(
      `${SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/rpc/public_field_snapshot`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: '{}',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        next: { revalidate: SNAPSHOT_REVALIDATE_SECONDS, tags: ['field-snapshot'] },
      }
    )

    if (!response.ok) {
      console.error('[field-data] snapshot read failed with status', response.status)
      return { state: 'unavailable' }
    }

    payload = await response.json()
  } catch (error) {
    console.error('[field-data] snapshot read threw:', error)
    return { state: 'unavailable' }
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    (payload as { published?: unknown }).published === false
  ) {
    return { state: 'unpublished' }
  }

  const snapshot = parseSnapshot(payload)
  return snapshot ? { state: 'ok', snapshot } : { state: 'unavailable' }
}

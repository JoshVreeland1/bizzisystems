'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'

/** Fires one market-page view event after hydration. Carries no personal data. */
export default function PageViewTracker({
  event,
}: {
  event: 'city_page_view' | 'warehouse_page_view'
}) {
  useEffect(() => {
    track(event)
  }, [event])

  return null
}

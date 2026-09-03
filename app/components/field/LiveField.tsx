'use client'

import { useCallback, useEffect, useState } from 'react'
import { track } from '@/lib/analytics'
import { formatElapsed, formatObservedWindow, formatSiteTime } from '@/lib/field-data/format'
import type { FieldDataResult } from '@/lib/field-data/types'
import FieldAnalytics from './FieldAnalytics'
import SensorDetail from './SensorDetail'
import StallDiagram from './StallDiagram'

const REFRESH_MS = 60_000

function LiveBadge({ stale }: { stale: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${
        stale ? 'bg-surface-2 text-muted' : 'bg-vacant-tint text-vacant'
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${stale ? 'bg-muted' : 'bg-vacant'}`}
      />
      {stale ? 'Feed quiet' : 'Live'}
    </span>
  )
}

/**
 * The public field experience: a diagram of the monitored stalls, the sensor
 * card for whichever is selected, and the analytics behind them.
 *
 * Everything is read-only and comes from one sanitized snapshot. The panel
 * polls while the tab is visible and shows nothing at all when the feed is
 * unreachable.
 */
export default function LiveField({
  initial,
  interactionSource,
}: {
  initial: FieldDataResult
  interactionSource: 'validation_interaction' | 'platform_interaction'
}) {
  const [result, setResult] = useState(initial)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/public/field-data', { cache: 'no-store' })
      if (!response.ok) return
      setResult((await response.json()) as FieldDataResult)
    } catch {
      // Keep the last good reading rather than blanking the panel.
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh()
    }, REFRESH_MS)
    return () => window.clearInterval(timer)
  }, [refresh])

  const spaces = result.state === 'ok' ? result.snapshot.spaces : []
  const selected = spaces.find((space) => space.key === selectedKey) ?? spaces[0] ?? null

  if (result.state !== 'ok' || !selected) {
    return (
      <div className="rounded-md border border-line bg-surface px-5 py-6">
        <p className="measure text-[16px] leading-relaxed text-muted">
          The public field feed is not reachable right now. This panel reads the live
          deployment, so it stays empty until the connection comes back.
        </p>
      </div>
    )
  }

  const { snapshot } = result

  function select(key: string) {
    setSelectedKey(key)
    track(interactionSource, { control: 'stall_select' })
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex items-center gap-3">
          <LiveBadge stale={snapshot.stale} />
          <span className="text-[13px] text-muted">
            {snapshot.spacesOnline} of {snapshot.spacesMonitored} sensors reporting
          </span>
        </div>
        <span data-numeric className="text-[13px] text-muted">
          Updated{' '}
          {now === null
            ? formatSiteTime(snapshot.generatedAt, snapshot.site.timeZone)
            : formatElapsed(snapshot.lastEventAt ?? snapshot.generatedAt, now)}
        </span>
      </div>

      <div className="mt-6">
        <StallDiagram spaces={spaces} selectedKey={selected.key} onSelect={select} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SensorDetail space={selected} now={now} />
        </div>
        <div className="min-w-0 lg:col-span-8">
          <FieldAnalytics
            snapshot={snapshot}
            selectedKey={selected.key}
            onSelect={select}
            interactionSource={interactionSource}
          />
        </div>
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-muted">
        Rates cover {formatObservedWindow(snapshot.windowStart, snapshot.generatedAt)} at the
        Austin field site.
      </p>
    </div>
  )
}

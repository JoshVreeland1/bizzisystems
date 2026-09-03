import { Container } from '../site/Container'
import { SecondaryCta } from '../site/Cta'
import { MetricRow } from '../site/MetricDisplay'
import { getFieldSnapshot } from '@/lib/field-data/server'
import { formatCount, formatObservedWindow, formatSiteTime } from '@/lib/field-data/format'
import { FIELD_SITE } from '@/lib/site'

/**
 * The narrow field-proof band that sits under the hero.
 *
 * Every number here is read from the deployment. Nothing is hard-coded, and a
 * metric that the field data cannot support is omitted rather than estimated —
 * which is why there is no accuracy figure in this strip until validated
 * observations exist.
 */
export default async function FieldStrip() {
  const result = await getFieldSnapshot()

  const heading =
    result.state === 'ok'
      ? `Live field validation · ${result.snapshot.site.city}`
      : `Live field validation · ${FIELD_SITE.city}`

  return (
    <section aria-labelledby="field-strip" className="border-y border-line bg-surface">
      <Container>
        <div className="grid gap-8 py-10 md:grid-cols-12 md:gap-10 md:py-12">
          <div className="md:col-span-4">
            <h2
              id="field-strip"
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-strong"
            >
              {heading}
            </h2>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-muted">
              {result.state === 'ok'
                ? `Read from the running deployment in ${result.snapshot.site.city} over ${formatObservedWindow(result.snapshot.windowStart, result.snapshot.generatedAt)}.`
                : 'A three-sensor deployment is running in Austin. The public data feed is not reachable right now.'}
            </p>
            <div className="mt-4">
              <SecondaryCta href="/validation">See live validation</SecondaryCta>
            </div>
          </div>

          <div className="md:col-span-8">
            {result.state === 'ok' ? (
              <MetricRow
                size="sm"
                columns={4}
                metrics={[
                  {
                    label: 'Monitored spaces',
                    value: formatCount(result.snapshot.spacesMonitored),
                    note:
                      result.snapshot.site.daysElapsed === null
                        ? 'Stalls under measurement'
                        : `Day ${formatCount(result.snapshot.site.daysElapsed + 1)} of the deployment`,
                  },
                  {
                    label: 'Sensors reporting',
                    value: `${result.snapshot.spacesOnline} of ${result.snapshot.spacesMonitored}`,
                    note:
                      result.snapshot.spacesOffline === 0
                        ? 'None down'
                        : `${formatCount(result.snapshot.spacesOffline)} down`,
                  },
                  {
                    label: 'Occupancy events',
                    value: formatCount(result.snapshot.occupancyEvents),
                    note: `In ${formatObservedWindow(result.snapshot.windowStart, result.snapshot.generatedAt)}`,
                  },
                  {
                    label: 'Last event',
                    value: formatSiteTime(
                      result.snapshot.lastEventAt,
                      result.snapshot.site.timeZone
                    ),
                    note: 'Site local time',
                  },
                ]}
              />
            ) : (
              <p className="max-w-md border-l-2 border-line-strong pl-5 text-[15px] leading-relaxed text-muted">
                The figures come back when the feed reconnects. Until then there is
                nothing here worth printing.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

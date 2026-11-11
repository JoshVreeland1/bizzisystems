import { Section } from '../components/site/Container'
import PageHeader from '../components/site/PageHeader'
import { SecondaryCta } from '../components/site/Cta'
import MeetingCta from '../components/site/MeetingCta'
import PhotoWithCaption from '../components/site/PhotoWithCaption'
import { MetricRow } from '../components/site/MetricDisplay'
import AccuracyPanel from '../components/field/AccuracyPanel'
import LiveField from '../components/field/LiveField'
import { getFieldSnapshot } from '@/lib/field-data/server'
import {
  formatCount,
  formatObservedWindow,
  formatSiteDate,
  formatSiteTime,
} from '@/lib/field-data/format'
import { createPageMetadata, FIELD_SITE } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'Field Validation',
  description:
    'Live field validation of the Bizzi PS Sensor in Austin, Texas: the running deployment, the public data it produces, how detection accuracy is measured, and what it cannot show yet.',
  path: '/validation',
})

export const revalidate = 60

const DEFINITIONS: [string, string][] = [
  ['Occupancy rate', 'Occupied duration divided by observable duration.'],
  ['Dwell', 'Duration of one completed occupancy session.'],
  ['Average dwell', 'Mean duration of completed occupancy sessions.'],
  ['Turnover', 'Completed occupancy sessions divided by observed stall-days.'],
  ['Vacancy duration', 'Time between occupancy sessions.'],
  [
    'Detection accuracy',
    'Matching validated stall observations divided by all validated stall observations.',
  ],
]

const LIMITATIONS = [
  'Occupancy calculations begin when a stored state is known. A space contributes nothing to a rate for any period before its first recorded reading.',
  'Open sessions are excluded from completed-session dwell averages, so a vehicle that is still in a space does not pull the average down.',
  'A short deployment produces a small sample. The figures here describe three spaces at one site over one period.',
  'Adjacent vehicles, nearby metal, mixed vehicle types, weather and real-world radio conditions are all known hard cases for this kind of sensing. Structured field validation is how we find out how they behave here.',
]

export default async function ValidationPage() {
  const result = await getFieldSnapshot()
  const snapshot = result.state === 'ok' ? result.snapshot : null

  return (
    <>
      <PageHeader
        eyebrow="Validation"
        title="Live field validation in Austin."
        lead={`A three-sensor deployment is running in ${FIELD_SITE.city}. This page shows what it is producing, how the numbers are defined, and what the deployment has not established yet.`}
      />

      {/* Current field deployment */}
      <Section tone="surface" labelledBy="deployment">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="deployment" className="text-[28px] md:text-[34px]">
              Current field deployment
            </h2>
            <dl className="mt-8 border-t border-line">
              {[
                ['Site', snapshot?.site.name ?? FIELD_SITE.name],
                ['Location', snapshot?.site.city ?? FIELD_SITE.city],
                [
                  'Started',
                  snapshot
                    ? formatSiteDate(snapshot.site.startedAt, snapshot.site.timeZone)
                    : '—',
                ],
                [
                  'Running for',
                  snapshot?.site.daysElapsed === null || snapshot === null
                    ? '—'
                    : snapshot.site.scheduledDays
                      ? `Day ${formatCount(snapshot.site.daysElapsed + 1)} of ${formatCount(snapshot.site.scheduledDays)}`
                      : `${formatCount(snapshot.site.daysElapsed)} days`,
                ],
                [
                  'Monitored spaces',
                  snapshot ? formatCount(snapshot.spacesMonitored) : '—',
                ],
                ['Space types', 'Regular, pickup and ADA'],
              ].map(([term, detail]) => (
                <div
                  key={term}
                  className="grid grid-cols-1 gap-1 border-b border-line py-4 sm:grid-cols-3 sm:gap-6"
                >
                  <dt className="text-[15px] font-medium text-ink">{term}</dt>
                  <dd className="text-[15px] leading-relaxed text-muted sm:col-span-2">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[14px] leading-relaxed text-muted">
              The deployment runs on private property with the owner&rsquo;s permission.
              We keep the host and the exact location off this page. Nobody pays for the
              sensors that are there; they are up so we can test them in the open.
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <PhotoWithCaption
              src="/media/sensor-at-curb.jpg"
              alt="A Bizzi PS Sensor bonded to the curb face of a monitored parking space in Austin, photographed at ground level."
              caption={`Installed sensor at the field site in ${FIELD_SITE.city}. Bonded to the curb face, with no pavement cut at this installation.`}
              aspect="aspect-[3/2]"
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </div>
        </div>
      </Section>

      {/* Public live data. Given the full grid rather than a side column: the
          chart and the space list both need the width to stay readable. */}
      <Section divide labelledBy="live-data">
        <div className="grid gap-6 md:grid-cols-12 md:gap-16">
          <h2 id="live-data" className="text-[28px] md:col-span-5 md:text-[34px]">
            Public live data
          </h2>
          <div className="md:col-span-7">
            <p className="text-[16px] leading-relaxed text-muted">
              A read-only view of the running deployment. Select a space to see its
              current state, how long it has held it, and how it has been used since the
              deployment started.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-muted">
              This is a sanitized public feed. Hardware identifiers, radio telemetry,
              addresses and the operator dashboard are not part of it.
            </p>
          </div>
        </div>
        <div className="mt-12">
          <LiveField initial={result} interactionSource="validation_interaction" />
        </div>
      </Section>

      {/* Validation metrics */}
      <Section tone="surface" labelledBy="accuracy">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="accuracy" className="text-[28px] md:text-[34px]">
              Accuracy validation
            </h2>
            <p className="measure mt-5 text-[16px] leading-relaxed text-muted">
              An accuracy check-in is a person at the site recording what they can see in
              each monitored space at a given moment. The platform stores the state it
              was reporting for that space at that same moment, and whether the two
              agreed.
            </p>
            <p className="measure mt-4 text-[16px] leading-relaxed text-muted">
              The denominator is validated stall observations, never visits. One check-in
              covering three spaces produces three observations.
            </p>
          </div>
          <div className="lg:col-span-8">
            {snapshot ? (
              <AccuracyPanel accuracy={snapshot.accuracy} />
            ) : (
              <p className="border-l-2 border-line-strong pl-5 text-[16px] leading-relaxed text-muted">
                Validation figures are read live from the deployment and are not
                reachable right now. Nothing is substituted in their place.
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* System performance */}
      <Section divide labelledBy="performance">
        <h2 id="performance" className="text-[28px] md:text-[34px]">
          System performance
        </h2>
        <div className="mt-9">
          {snapshot ? (
            <>
              <MetricRow
                size="sm"
                columns={5}
                metrics={[
                  {
                    label: 'Sensors reporting',
                    value: `${snapshot.spacesOnline} of ${snapshot.spacesMonitored}`,
                    note: snapshot.stale
                      ? 'The feed has gone quiet'
                      : 'Checked in on schedule',
                  },
                  {
                    label: 'Sensors down',
                    value: formatCount(snapshot.spacesOffline),
                    note:
                      snapshot.spacesOffline === 0
                        ? 'None currently offline'
                        : 'Not reporting right now',
                  },
                  {
                    label: 'Occupancy events',
                    value: formatCount(snapshot.occupancyEvents),
                    note: `Recorded in ${formatObservedWindow(snapshot.windowStart, snapshot.generatedAt)}`,
                  },
                  {
                    label: 'Last event',
                    value: formatSiteTime(snapshot.lastEventAt, snapshot.site.timeZone),
                    note: 'Site local time',
                  },
                  {
                    label: 'History behind this',
                    value: formatObservedWindow(
                      snapshot.windowStart,
                      snapshot.generatedAt
                    ).replace(/^the /, ''),
                    note: `Capped at ${snapshot.windowDays} days once there is more`,
                  },
                ]}
              />
              <p className="measure-wide mt-8 text-[15px] leading-relaxed text-muted">
                There is no uptime percentage on this page yet. A few days of history is
                too little for that number to mean anything.
              </p>
            </>
          ) : (
            <p className="border-l-2 border-line-strong pl-5 text-[16px] leading-relaxed text-muted">
              System performance is read live and is not reachable right now.
            </p>
          )}
        </div>
      </Section>

      {/* Methodology */}
      <Section tone="navy" labelledBy="methodology">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="methodology" className="text-[28px] md:text-[34px]">
              Definitions
            </h2>
            <p className="measure mt-5 text-[16px] leading-relaxed text-muted-on-dark">
              These are the same definitions the platform uses to produce a period
              report, stated the same way.
            </p>
          </div>
          <div className="lg:col-span-8">
            <dl className="border-t border-line-on-dark">
              {DEFINITIONS.map(([term, detail]) => (
                <div
                  key={term}
                  className="grid grid-cols-1 gap-1 border-b border-line-on-dark py-4 sm:grid-cols-5 sm:gap-6"
                >
                  <dt className="text-[15px] font-medium text-white sm:col-span-2">
                    {term}
                  </dt>
                  <dd className="text-[15px] leading-relaxed text-muted-on-dark sm:col-span-3">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {/* Limitations */}
      <Section labelledBy="limits">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="limits" className="text-[28px] md:text-[34px]">
              What this does not establish
            </h2>
            <p className="measure mt-5 text-[16px] leading-relaxed text-muted">
              A deployment that has been running for days is early evidence. Read it that
              way.
            </p>
            <div className="mt-6">
              <SecondaryCta href="/platform">See what the platform does</SecondaryCta>
            </div>
          </div>
          <div className="lg:col-span-8">
            <ul className="border-t border-line">
              {LIMITATIONS.map((item) => (
                <li
                  key={item}
                  className="border-b border-line py-5 text-[16px] leading-relaxed text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <MeetingCta
        heading="Watch it, then scope one."
        body="If the evidence here is the kind you would want from your own site, the next step is deciding which spaces would have to be measured to settle the question."
        source="validation_footer"
      />
    </>
  )
}

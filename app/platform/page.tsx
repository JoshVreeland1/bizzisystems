import { Section } from '../components/site/Container'
import PageHeader from '../components/site/PageHeader'
import { SecondaryCta } from '../components/site/Cta'
import PhotoWithCaption from '../components/site/PhotoWithCaption'
import { TechnicalFlow } from '../components/site/TechnicalFlow'
import MeetingCta from '../components/site/MeetingCta'
import LiveField from '../components/field/LiveField'
import { getFieldSnapshot } from '@/lib/field-data/server'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'Bizzi Platform | Occupancy Sensors & Analytics',
  description:
    'How the Bizzi PS Sensor, the receiver and the Bizzi platform work as one system: live occupancy, dwell, turnover, sensor health, reporting and API delivery.',
  path: '/platform',
})

export const revalidate = 60

const ARCHITECTURE = [
  {
    label: 'The space',
    detail: 'One monitored stall or bay. One sensor.',
  },
  {
    label: 'Bizzi PS Sensor',
    detail:
      'Reads the local magnetic field and decides whether the space is occupied.',
  },
  {
    label: 'Receiver / gateway',
    detail: 'Collects transmissions from the sensors on site over LoRa.',
  },
  {
    label: 'Bizzi backend',
    detail:
      'Writes each state change with its own timestamp and keeps the history.',
  },
  {
    label: 'Platform and buyer systems',
    detail: 'Live status, analytics and reports, or an API into your own systems.',
  },
]

const CAPABILITIES: [string, string][] = [
  ['Live occupancy', 'Current state for every monitored space, updated as it changes.'],
  ['Historical occupancy', 'Every state change kept with its timestamp, not sampled.'],
  ['Dwell', 'Duration of each completed occupancy, per space.'],
  ['Turnover', 'Completed occupancy sessions measured against observed stall-days.'],
  ['Occupancy rate', 'Occupied time as a share of the time the space was observed.'],
  ['Utilization and availability', 'How much of the monitored set is in use right now.'],
  ['Sensor health', 'Which units are reporting on schedule and which have gone quiet.'],
  ['Battery visibility', 'Battery level and a low-battery flag reported with the data.'],
  ['Reporting', 'Period reports covering occupancy, dwell, turnover and system performance.'],
  ['Integrations', 'Occupancy records available through an API for delivery into other systems.'],
]

const NOT_SUPPORTED = [
  'No cameras and no video. The sensor reports whether a space is occupied. There is no footage to store, redact or produce later.',
  'No license plates and no vehicle identity. Bizzi cannot tell one vehicle from another.',
  'Occupancy and duration go to the staff who make enforcement decisions.',
]

export default async function PlatformPage() {
  const fieldData = await getFieldSnapshot()

  return (
    <>
      <PageHeader
        eyebrow="Platform"
        title="From a space to a record, in one system."
        lead="Bizzi sells one system. A sensor decides whether a space is occupied, the platform stores that decision with a timestamp, and the analytics read off the stored record."
      />

      <Section tone="surface" labelledBy="architecture">
        <h2 id="architecture" className="text-[24px] md:text-[30px]">
          How a reading travels.
        </h2>
        <div className="mt-9">
          <TechnicalFlow
            steps={ARCHITECTURE}
            columns={5}
            ariaLabel="Path of an occupancy reading, from the monitored space to the platform"
          />
        </div>
      </Section>

      <Section divide labelledBy="sensor">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="sensor" className="text-[28px] md:text-[34px]">
              The sensor
            </h2>
            <p className="measure mt-6 text-[16px] leading-relaxed text-muted">
              A magnetometer reads the change a vehicle makes to the local magnetic
              field. The housing bonds to the surface, so a typical installation does
              not cut into pavement and does not need the space taken out of service for
              long.
            </p>
            <p className="measure mt-4 text-[16px] leading-relaxed text-muted">
              The head separates from the bonded backplate. A unit can be replaced
              without redoing the mount or re-surveying the space.
            </p>
            <dl className="mt-8 border-t border-line">
              {[
                ['Dimensions', '4.72 × 2.2 × 1.30 in'],
                ['Housing', 'UV-stabilized polycarbonate with tamper-resistant screws'],
                ['Detection', 'Magnetometer'],
                ['Radio', 'LoRa, to an on-site receiver'],
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
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <PhotoWithCaption
              src="/media/sensor-render.png"
              alt="Product render of the Bizzi PS Sensor showing its 4.72 by 2.2 by 1.30 inch dimensions."
              caption="Bizzi PS Sensor, current MVP housing."
              aspect="aspect-[3/2]"
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section tone="surface" labelledBy="capabilities">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="capabilities" className="text-[28px] md:text-[34px]">
              What the platform holds.
            </h2>
            <p className="measure mt-5 text-[16px] leading-relaxed text-muted">
              Everything below is running today.
            </p>
          </div>
          <div className="lg:col-span-8">
            <dl className="border-t border-line">
              {CAPABILITIES.map(([term, detail]) => (
                <div
                  key={term}
                  className="grid grid-cols-1 gap-1 border-b border-line py-4 sm:grid-cols-5 sm:gap-6"
                >
                  <dt className="text-[15px] font-medium text-ink sm:col-span-2">{term}</dt>
                  <dd className="text-[15px] leading-relaxed text-muted sm:col-span-3">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section divide labelledBy="live">
        <div className="grid gap-6 md:grid-cols-12 md:gap-16">
          <h2 id="live" className="text-[28px] md:col-span-5 md:text-[34px]">
            On live data.
          </h2>
          <p className="text-[16px] leading-relaxed text-muted md:col-span-7">
            The same record, read from the Austin deployment. Select a space to see its
            occupancy rate, average dwell and shape across the day.
          </p>
        </div>
        <div className="mt-12">
          <LiveField
            initial={fieldData}
            interactionSource="platform_interaction"
            showCoverageNote={false}
          />
        </div>
      </Section>

      <Section tone="navy" labelledBy="limits">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="limits" className="text-[28px] md:text-[34px]">
              What Bizzi does not do.
            </h2>
            <p className="measure mt-5 text-[16px] leading-relaxed text-muted-on-dark">
              These are the first questions a public agency asks.
            </p>
          </div>
          <div className="lg:col-span-8">
            <ul className="border-t border-line-on-dark">
              {NOT_SUPPORTED.map((item) => (
                <li
                  key={item}
                  className="border-b border-line-on-dark py-5 text-[16px] leading-relaxed text-muted-on-dark"
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <SecondaryCta href="/validation" onDark>
                See how accuracy is measured
              </SecondaryCta>
            </div>
          </div>
        </div>
      </Section>

      <MeetingCta
        body="Bring a site and a number of spaces. We will work out what a deployment there would need to measure and what it would take to install."
        source="platform_footer"
      />
    </>
  )
}

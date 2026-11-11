import { Container, Eyebrow, Section } from './components/site/Container'
import { PrimaryCta, SecondaryCta } from './components/site/Cta'
import PhotoWithCaption from './components/site/PhotoWithCaption'
import GateVsBayDiagram from './components/site/GateVsBayDiagram'
import MeetingCta from './components/site/MeetingCta'
import FieldStrip from './components/field/FieldStrip'
import LiveField from './components/field/LiveField'
import { getFieldSnapshot } from '@/lib/field-data/server'
import { createPageMetadata, HOME_DESCRIPTION, HOME_TITLE } from '@/lib/site'

export const metadata = createPageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: '/',
})

export const revalidate = 60

const CITY_QUESTIONS = [
  'Which blocks are full at 2 p.m. and empty at 7 p.m.?',
  'How long are vehicles staying?',
  'Which spaces consistently go unused?',
  'What does actual occupancy say before rates, regulations or capital plans change?',
]

const WAREHOUSE_QUESTIONS = [
  'How long is a trailer actually at the bay?',
  'Which bays carry the most dwell?',
  'When does capacity tighten?',
  'Does the gate timestamp describe what happened at the dock?',
]

const CITY_MEASURES = [
  ['Live status', 'Occupied or vacant, per monitored stall.'],
  ['Dwell', 'How long each vehicle held the space.'],
  ['Turnover', 'Completed sessions against observed stall-days.'],
  ['Occupancy rate', 'Occupied time as a share of observed time.'],
  ['History', 'Every state change, timestamped and kept.'],
]

const SENSOR_FACTS = [
  ['Dimensions', '4.72 × 2.2 × 1.30 in'],
  ['Sensing', 'Magnetometer. No camera, no video, no plate data.'],
  ['Mounting', 'Adhesive-bonded backplate with a replaceable sensor head.'],
  ['Connectivity', 'LoRa to an on-site receiver, then to the cloud.'],
  ['Housing', 'UV-stabilized polycarbonate, tamper-resistant screws.'],
]

export default async function HomePage() {
  const fieldData = await getFieldSnapshot()

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <Container>
          <div className="grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-14 lg:py-24">
            <div className="lg:col-span-6">
              <h1 className="text-[36px] sm:text-[44px] lg:text-[54px]">
                Measure occupancy at the stall or bay.
              </h1>
              <p className="measure-wide mt-6 text-[17px] leading-relaxed text-muted md:text-[19px]">
                Bizzi uses surface-mounted, camera-free sensors to measure individual
                parking stalls and loading bays. Each occupancy change becomes live
                status, dwell, utilization and history in the Bizzi platform.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <PrimaryCta size="lg" source="home_hero" />
                <SecondaryCta href="/validation">See live validation</SecondaryCta>
              </div>
            </div>

            <div className="lg:col-span-6">
              <PhotoWithCaption
                src="/media/sensor-at-curb.jpg"
                alt="A Bizzi PS Sensor bonded to the face of a parking-lot curb, seen at ground level with gravel in the foreground."
                caption="A Bizzi PS Sensor on the curb face at the Austin field site. Surface mounted, with no pavement cut at this installation."
                aspect="aspect-[3/2]"
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
              />
            </div>
          </div>
        </Container>
      </section>

      <FieldStrip />

      {/* Buyer questions */}
      <Section labelledBy="questions">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="questions" className="text-[28px] md:text-[34px]">
              The questions change. The missing measurement is the same.
            </h2>
            <p className="measure mt-6 text-[16px] leading-relaxed text-muted">
              A parking director and a distribution-center manager describe different
              problems. Both come down to how long a specific space was occupied.
            </p>
          </div>

          <div className="grid gap-10 lg:col-span-8 lg:grid-cols-2 lg:gap-12">
            {[
              { heading: 'In a city', questions: CITY_QUESTIONS, href: '/cities' },
              { heading: 'In a facility', questions: WAREHOUSE_QUESTIONS, href: '/warehouses' },
            ].map((group) => (
              <div key={group.heading}>
                <Eyebrow>{group.heading}</Eyebrow>
                <ul className="mt-5 border-t border-line">
                  {group.questions.map((question) => (
                    <li
                      key={question}
                      className="border-b border-line py-5 text-[17px] leading-snug text-ink"
                    >
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Live data */}
      <Section tone="surface" labelledBy="live-data">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="live-data" className="text-[28px] md:text-[34px]">
              The current reading from Austin.
            </h2>
            <p className="measure mt-5 text-[16px] leading-relaxed text-muted">
              This panel reads the running deployment, not a recording. Pick a space to
              see how it has been used over the last week.
            </p>
            <div className="mt-5">
              <SecondaryCta href="/validation">Methodology and accuracy</SecondaryCta>
            </div>
          </div>
          <div className="lg:col-span-8">
            <LiveField initial={fieldData} interactionSource="validation_interaction" />
          </div>
        </div>
      </Section>

      {/* Cities */}
      <Section divide labelledBy="cities">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>Cities</Eyebrow>
            <h2 id="cities" className="mt-4 text-[28px] md:text-[34px]">
              Know which stalls are occupied. Understand how they are used.
            </h2>
            <p className="measure mt-6 text-[16px] leading-relaxed text-muted">
              Parking and curb teams get a live view of each monitored space and the
              record behind it, so a rate change, a time-limit change or a capital
              request can point at measured occupancy instead of a sample count.
            </p>
            <p className="measure mt-4 text-[16px] leading-relaxed text-muted">
              Bizzi reports occupancy and duration. It does not identify vehicles or
              issue citations.
            </p>
            <div className="mt-7">
              <SecondaryCta href="/cities">What cities measure</SecondaryCta>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <dl className="border-t border-line">
              {CITY_MEASURES.map(([term, detail]) => (
                <div
                  key={term}
                  className="grid grid-cols-1 gap-1 border-b border-line py-5 sm:grid-cols-3 sm:gap-6"
                >
                  <dt className="text-[15px] font-medium text-ink">{term}</dt>
                  <dd className="text-[15px] leading-relaxed text-muted sm:col-span-2">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {/* Warehouses */}
      <Section tone="surface" labelledBy="warehouses">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>Warehouses</Eyebrow>
            <h2 id="warehouses" className="mt-4 text-[28px] md:text-[34px]">
              Measure dwell at the bay, not just the gate.
            </h2>
            <p className="measure mt-6 text-[16px] leading-relaxed text-muted">
              Gate and yard systems can tell an operator when a truck entered a
              facility. Bizzi is designed to measure how long the monitored bay itself
              was occupied, with a start and an end timestamp on each occupancy.
            </p>
            <div className="mt-7">
              <SecondaryCta href="/warehouses">How bay dwell is recorded</SecondaryCta>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <GateVsBayDiagram />
          </div>
        </div>
      </Section>

      {/* The sensor */}
      <Section divide labelledBy="sensor">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <PhotoWithCaption
              src="/media/sensor-render.png"
              alt="Product render of the Bizzi PS Sensor, a rounded rectangular white enclosure with four recessed screws and an embossed Bizzi mark, annotated with its dimensions."
              caption="Bizzi PS Sensor. The sensor head lifts off a bonded backplate, so a unit can be swapped without disturbing the mount."
              aspect="aspect-[3/2]"
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 id="sensor" className="text-[28px] md:text-[34px]">
              One device per space.
            </h2>
            <p className="measure mt-6 text-[16px] leading-relaxed text-muted">
              The sensor detects a vehicle by the change it makes to the local magnetic
              field. The reading is binary: the space is occupied, or it is empty. No
              image, no plate.
            </p>
            <dl className="mt-8 border-t border-line">
              {SENSOR_FACTS.map(([term, detail]) => (
                <div key={term} className="border-b border-line py-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                    {term}
                  </dt>
                  <dd className="mt-1.5 text-[15px] leading-relaxed text-ink">{detail}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-7">
              <SecondaryCta href="/platform">Explore the platform</SecondaryCta>
            </div>
          </div>
        </div>
      </Section>

      <MeetingCta
        body="Tell us what you are trying to measure. We will use the meeting to understand the site, the number of spaces, and what a useful deployment would need to prove."
        source="home_footer"
        secondary={{ href: '/validation', label: 'See live validation' }}
      />
    </>
  )
}

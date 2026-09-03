import type { Metadata } from 'next'
import { Container, Eyebrow, Section } from '../components/site/Container'
import { SecondaryCta } from '../components/site/Cta'
import GateVsBayDiagram from '../components/site/GateVsBayDiagram'
import MeetingCta from '../components/site/MeetingCta'
import PageViewTracker from '../components/site/PageViewTracker'
import PhotoWithCaption from '../components/site/PhotoWithCaption'
import { StateSequence } from '../components/site/TechnicalFlow'

export const metadata: Metadata = {
  title: 'Loading Bay Dwell & Utilization Data',
  description:
    'Bay-level occupancy and dwell records for distribution centers, warehouses and 3PLs. Start and end timestamps on the monitored bay itself, not the gate.',
  alternates: { canonical: '/warehouses' },
}

const RECORD_STEPS = [
  { state: 'Truck arrives', note: 'A trailer backs into a monitored bay.' },
  {
    state: 'Bay occupied',
    note: 'The sensor detects the change and the space changes state.',
  },
  {
    state: 'Timestamp start',
    note: 'The moment the bay became occupied is written with the event.',
  },
  {
    state: 'Bay vacant',
    note: 'The trailer pulls out and the space changes state again.',
  },
  {
    state: 'Timestamp end',
    note: 'The close of the occupancy is written the same way.',
  },
  {
    state: 'Dwell recorded',
    note: 'The completed session becomes one durable record with a start, an end and a duration.',
  },
]

const RECORDS_SUPPORT: [string, string][] = [
  [
    'Bay utilization',
    'How much of the day each monitored door actually carried a trailer, and which doors carry the load.',
  ],
  [
    'Historical dwell analysis',
    'Dwell by bay, by day and by hour, read from stored sessions rather than reconstructed from paperwork.',
  ],
  [
    'Documentation',
    'A bay-level record of when a space was occupied, available when a conversation about a specific window comes up.',
  ],
  [
    'Operational review',
    'A shared set of numbers for a shift or a period, defined the same way every time.',
  ],
  [
    'Integration',
    'Occupancy records available through an API so they can sit alongside the systems already in use.',
  ],
]

export default function WarehousesPage() {
  return (
    <>
      <PageViewTracker event="warehouse_page_view" />

      <section className="border-b border-line bg-white">
        <Container>
          <div className="grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>Warehouses</Eyebrow>
              <h1 className="mt-4 text-[34px] sm:text-[40px] lg:text-[46px]">
                Measure dwell at the bay, not just the gate.
              </h1>
              <p className="mt-6 text-[17px] leading-relaxed text-muted md:text-[19px]">
                Gate and yard systems can tell an operator when a truck entered a
                facility. Bizzi is designed to measure how long the monitored bay itself
                is occupied.
              </p>
            </div>
            <div className="min-w-0 lg:col-span-7">
              <GateVsBayDiagram />
            </div>
          </div>
        </Container>
      </section>

      <Section tone="surface" labelledBy="record">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="record" className="text-[28px] md:text-[34px]">
              What one occupancy looks like.
            </h2>
            <p className="measure mt-6 text-[16px] leading-relaxed text-muted">
              The sensor is not counting trucks or watching a yard. It is watching one
              space, and it writes down when that space changed.
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <StateSequence
              steps={RECORD_STEPS}
              ariaLabel="Sequence of events recorded for one bay occupancy"
            />
          </div>
        </div>
      </Section>

      <Section divide labelledBy="supports">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="supports" className="text-[28px] md:text-[34px]">
              What those records support.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <dl className="border-t border-line">
              {RECORDS_SUPPORT.map(([term, detail]) => (
                <div
                  key={term}
                  className="grid grid-cols-1 gap-1 border-b border-line py-5 sm:grid-cols-5 sm:gap-6"
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

      <Section tone="navy" labelledBy="honest">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="honest" className="text-[28px] md:text-[34px]">
              Where this stands today.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-[17px] leading-relaxed text-muted-on-dark">
              Bizzi has not run a warehouse deployment yet, so there are no dollar
              figures on this page. None of it has been measured at a facility.
            </p>
            <p className="mt-5 text-[17px] leading-relaxed text-muted-on-dark">
              The sensor and platform are measuring individual spaces in Austin right
              now, and the same system produces a bay-level dwell record. A first
              warehouse deployment is what turns that into an operational number. We are
              looking for a facility to run one.
            </p>
            <div className="mt-7">
              <SecondaryCta href="/validation" onDark>
                See what is running now
              </SecondaryCta>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="install">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <PhotoWithCaption
              src="/media/sensor-render.png"
              alt="Product render of the Bizzi PS Sensor with its dimensions marked: 4.72 by 2.2 by 1.30 inches."
              caption="One sensor per monitored bay, plus a receiver covering the group."
              aspect="aspect-[3/2]"
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="text-[28px] md:text-[34px]">A first deployment is small.</h2>
            <p className="measure mt-6 text-[16px] leading-relaxed text-muted">
              A handful of active doors, instrumented and left to run long enough to
              produce a period worth reading. Sensors mount to the surface, so a bay does
              not come out of service for construction work.
            </p>
            <p className="measure mt-4 text-[16px] leading-relaxed text-muted">
              A first deployment shows whether the dwell record matches what your team
              believes is happening at those doors.
            </p>
          </div>
        </div>
      </Section>

      <MeetingCta
        heading="Pick the doors you argue about most."
        body="Tell us about the facility and which bays cause the most trouble. We will use the meeting to work out what a first deployment there would need to prove."
        source="warehouses_footer"
      />
    </>
  )
}

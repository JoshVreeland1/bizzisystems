import type { Metadata } from 'next'
import { Section } from '../components/site/Container'
import PageHeader from '../components/site/PageHeader'
import { SecondaryCta } from '../components/site/Cta'
import MeetingCta from '../components/site/MeetingCta'
import PageViewTracker from '../components/site/PageViewTracker'
import PhotoWithCaption from '../components/site/PhotoWithCaption'

export const metadata: Metadata = {
  title: 'Parking Occupancy Data for Cities',
  description:
    'Per-stall occupancy, dwell, turnover and history for municipal parking and curb teams. Camera-free sensors, live status, and reports that show their own methodology.',
  alternates: { canonical: '/cities' },
}

const WORKFLOW: { stage: string; question: string; body: string[] }[] = [
  {
    stage: 'Current state',
    question: 'What is occupied right now?',
    body: [
      'Every monitored stall reports occupied or vacant, and how long it has held that state. Staff can see the block without driving it.',
    ],
  },
  {
    stage: 'Historical use',
    question: 'How are the spaces actually being used?',
    body: [
      'Each state change is stored with its own timestamp, so occupancy can be read back by hour, by day or across a whole study period rather than estimated from a handful of counts.',
    ],
  },
  {
    stage: 'Operations',
    question: 'Where are dwell and turnover creating problems?',
    body: [
      'Dwell shows how long vehicles stay. Turnover shows how many completed occupancies a space carried. A stall with high occupancy and almost no turnover is a different operational problem from one that cycles all day.',
    ],
  },
  {
    stage: 'Decisions',
    question: 'What does measured occupancy imply?',
    body: [
      'Rate changes, time limits, loading-zone placement and capital requests all rest on an assumption about how full something is. Bizzi replaces the assumption with a measurement of the specific spaces in question.',
    ],
  },
  {
    stage: 'Reporting',
    question: 'What can the department show afterwards?',
    body: [
      'A period report covers occupancy rate, average dwell, turnover and vacancy, occupancy per stall, system performance, and any disturbances logged during the period. It states its own definitions and its own coverage gaps.',
    ],
  },
  {
    stage: 'Deployment',
    question: 'How does the measurement system get installed?',
    body: [
      'Sensors bond to the surface and pair with a receiver on site. Scope, access and any permissions get worked out per site before installation, because those rules differ by jurisdiction.',
    ],
  },
]

const REPORT_CONTENTS = [
  ['Occupancy rate', 'Occupied duration divided by observable duration.'],
  ['Average dwell', 'Mean duration of completed occupancy sessions.'],
  ['Turnover', 'Completed occupancy sessions per observed stall-day.'],
  ['Vacancy duration', 'Time between occupancy sessions.'],
  ['Occupancy per stall', 'The same figures broken out space by space.'],
  ['System performance', 'Which sensors were reporting, and when they were not.'],
  ['Disturbances', 'Anything logged during the period that affected the data.'],
  ['Known limitations', 'What the period could not measure, stated in the report itself.'],
]

export default function CitiesPage() {
  return (
    <>
      <PageViewTracker event="city_page_view" />

      <PageHeader
        eyebrow="Cities"
        title="Know which stalls are empty."
        lead="Bizzi measures individual spaces continuously, giving parking teams live occupancy and the history behind it. The sensor is camera-free, so the only thing recorded about a space is whether a vehicle is in it."
        note="Written for parking directors, curb managers, transportation staff and the planning teams who get asked to justify a number."
      />

      <Section labelledBy="workflow">
        <h2 id="workflow" className="text-[28px] md:text-[34px]">
          The measurement, stage by stage.
        </h2>
        <dl className="mt-10 border-t border-line">
          {WORKFLOW.map((entry) => (
            <div
              key={entry.stage}
              className="grid gap-3 border-b border-line py-7 md:grid-cols-12 md:gap-8"
            >
              <dt className="md:col-span-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-strong">
                  {entry.stage}
                </span>
                <span className="mt-2 block text-[17px] font-medium leading-snug text-ink">
                  {entry.question}
                </span>
              </dt>
              <dd className="md:col-span-8 md:col-start-5">
                {entry.body.map((paragraph) => (
                  <p key={paragraph} className="text-[16px] leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="surface" labelledBy="report">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="report" className="text-[28px] md:text-[34px]">
              A report that shows its own arithmetic.
            </h2>
            <p className="measure mt-6 text-[16px] leading-relaxed text-muted">
              Occupancy figures are only useful if someone can check how they were
              produced. Every Bizzi period report ends with the definitions it used and
              the coverage it did not have, so a reviewer can argue with the method
              rather than guess at it.
            </p>
            <div className="mt-7">
              <SecondaryCta href="/validation">See the current field results</SecondaryCta>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <dl className="border-t border-line">
              {REPORT_CONTENTS.map(([term, detail]) => (
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

      <Section divide labelledBy="enforcement">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 id="enforcement" className="text-[28px] md:text-[34px]">
              Enforcement stays a human decision.
            </h2>
            <p className="measure mt-6 text-[16px] leading-relaxed text-muted">
              Bizzi reports that a space has been occupied and for how long. It does not
              know which vehicle is there, whether that vehicle holds a permit, or
              whether a citation is warranted. Those are judgements your staff make, and
              the platform is built to inform them rather than replace them.
            </p>
            <p className="measure mt-4 text-[16px] leading-relaxed text-muted">
              It also settles the privacy question early. There are no cameras in the
              system, so there is no footage to retain or hand over.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <PhotoWithCaption
              src="/media/sensor-at-curb.jpg"
              alt="A Bizzi PS Sensor bonded to a concrete curb face, photographed at ground level."
              caption="One sensor, one space. The reading it produces is occupied or vacant."
              aspect="aspect-[4/3]"
              sizes="(min-width: 1024px) 460px, 100vw"
            />
          </div>
        </div>
      </Section>

      <MeetingCta
        heading="Start with one block or one lot."
        body="Tell us which spaces you want measured and what the result would need to show. We will scope a deployment against that, including what it can and cannot answer."
        source="cities_footer"
      />
    </>
  )
}

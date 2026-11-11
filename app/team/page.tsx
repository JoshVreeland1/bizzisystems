import { Section } from '../components/site/Container'
import { SecondaryCta } from '../components/site/Cta'
import MeetingCta from '../components/site/MeetingCta'
import PageHeader from '../components/site/PageHeader'
import TeamProfile, { type TeamMember } from '../components/site/TeamProfile'
import Timeline, { type Milestone } from '../components/site/Timeline'
import { COMPANY_ADDRESS, createPageMetadata, FIELD_SITE } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'Team',
  description:
    'The founder behind Bizzi Systems, and how the company went from a first prototype on a curb to sensors running in the field in Austin.',
  path: '/team',
})

const TEAM: TeamMember[] = [
  {
    name: 'Josh Vreeland',
    title: 'Founder & Chief Executive Officer',
    owns: 'Product, fundraising and pipeline.',
    photo: { src: '/team/josh.png', objectPosition: 'center 18%' },
    bio: [
      'Josh hated parking so much he decided it’s what he should pursue. While studying economics at UT Austin, he built Bizzi’s first prototype and now serves as CEO.',
      'Before Bizzi, Josh built and sold a software platform and played collegiate football.',
    ],
  },
]

const MILESTONES: Milestone[] = [
  {
    stage: 'First prototype',
    heading: 'A device that could tell whether one space was in use.',
    body: [
      'The starting question was narrow: why should measuring a single parking space require a camera pointed at the street or a saw cut in the pavement? The first prototype was an attempt to answer that with a magnetometer and a radio.',
    ],
    image: {
      src: '/media/first-prototype.jpg',
      alt: 'Josh kneeling at a residential curb, fitting the first Bizzi prototype strip along the gutter line, with a drill and tape beside him.',
      caption: 'The first prototype going down on a curb.',
      aspect: 'aspect-square',
    },
  },
  {
    stage: 'Product development',
    heading: 'From a prototype into something installable.',
    body: [
      'The device became a sealed unit at 4.72 by 2.2 by 1.30 inches, in UV-stabilized polycarbonate with tamper-resistant screws. The head separates from a bonded backplate, so a unit can be swapped without redoing the mount.',
    ],
    image: {
      src: '/media/development.jpg',
      alt: 'Bizzi sensor housings, calipers, tools and an engineering notebook on a product-development workbench.',
      caption: 'Developing the current sensor housing.',
      aspect: 'aspect-square',
    },
  },
  {
    stage: 'Field installation',
    heading: 'Three spaces in Austin.',
    body: [
      `Sensors went onto regular, pickup and ADA spaces at a field site in ${FIELD_SITE.city}, with a receiver covering the group. That deployment has been running since September 2026.`,
    ],
    image: {
      src: '/media/sensor-at-curb.jpg',
      alt: 'A Bizzi PS Sensor bonded to the curb face of a monitored parking space, photographed at ground level.',
      caption: 'One of the three monitored spaces.',
      aspect: 'aspect-[4/3]',
    },
  },
  {
    stage: 'Working platform',
    heading: 'The software the sensors feed.',
    body: [
      'Every state change is stored with its own timestamp. Live status, occupancy rate, dwell, turnover, sensor health and period reporting all read off that record, and so does the accuracy check-in system used to validate it.',
    ],
    wideImage: {
      src: '/media/platform-analytics.jpg',
      alt: 'The Bizzi analytics dashboard: parking and sensor tabs, a stall filter, and datasets for occupancy, dwell, turnover, vacancy and peak demand.',
      caption: 'The operator analytics view.',
      aspect: 'aspect-[2000/944]',
    },
  },
]

export default function TeamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="Bizzi started with one question about one parking space."
        lead="Why should measuring whether a single space is occupied require a camera or cutting into pavement? Everything since has been the work of answering that, building the thing that answers it, and putting it outside where it has to hold up."
      />

      <Section tone="surface" labelledBy="chronology">
        <h2 id="chronology" className="text-[28px] md:text-[34px]">
          How it got here.
        </h2>
        <div className="mt-10">
          <Timeline milestones={MILESTONES} />
        </div>
      </Section>

      <Section divide labelledBy="team">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="team" className="text-[28px] md:text-[34px]">
              Who is doing the work.
            </h2>
            <p className="measure mt-5 text-[16px] leading-relaxed text-muted">
              Full time, and on the deployment.
            </p>
          </div>
          <div className="lg:col-span-8">
            <div className="border-t border-line">
              {TEAM.map((member) => (
                <TeamProfile key={member.name} member={member} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="navy" labelledBy="standing">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="standing" className="text-[28px] md:text-[34px]">
              Where the company stands.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-[17px] leading-relaxed text-muted-on-dark">
              Bizzi Systems, Inc. is a Delaware C-Corp based in Austin, founded in 2026.
              The company is pre-revenue. The sensor and the platform are built and
              running in the field. The commercial record begins with the deployments
              being scoped now.
            </p>
            <p className="mt-5 text-[17px] leading-relaxed text-muted-on-dark">
              Everything on the validation page comes off the deployment that is running
              today. Where a figure does not exist yet, the page says so.
            </p>
            <address className="mt-8 not-italic text-[15px] leading-relaxed text-muted-on-dark">
              {COMPANY_ADDRESS.street}
              <br />
              Austin, Texas {COMPANY_ADDRESS.postalCode}
            </address>
            <div className="mt-7">
              <SecondaryCta href="/validation" onDark>
                See the field deployment
              </SecondaryCta>
            </div>
          </div>
        </div>
      </Section>

      <MeetingCta
        body="If you run parking for a city or operations for a facility, the useful next conversation is about your spaces rather than ours."
        source="team_footer"
      />
    </>
  )
}

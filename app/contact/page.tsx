import type { Metadata } from 'next'
import { Section } from '../components/site/Container'
import PageHeader from '../components/site/PageHeader'
import DeploymentForm from '../components/contact/DeploymentForm'
import { COMPANY_ADDRESS, CONTACT_MAILTO, SCHEDULER } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Discuss a Deployment',
  description:
    'Tell us what you are trying to measure and we will scope a Bizzi deployment against it: the site, the number of spaces, and what it would need to prove.',
  alternates: { canonical: '/contact' },
}

const AGENDA = [
  ['The site', 'Which spaces, what surface, and what is physically around them.'],
  ['The count', 'How many stalls or bays would have to be instrumented to answer the question.'],
  [
    'The test',
    'What the result would need to show for this to be worth continuing, written down before it starts.',
  ],
  [
    'The constraints',
    'Access, approvals and anything about the site that would shape how installation works.',
  ],
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Discuss a deployment."
        lead="Tell us what you are trying to measure. We will use the meeting to understand the site, the number of spaces, and what a useful deployment would need to prove."
      />

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <DeploymentForm scheduler={SCHEDULER} />
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <h2 className="text-[20px] font-semibold text-ink">What the meeting covers</h2>
            <dl className="mt-6 border-t border-line">
              {AGENDA.map(([term, detail]) => (
                <div key={term} className="border-b border-line py-4">
                  <dt className="text-[15px] font-medium text-ink">{term}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-muted">{detail}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-[15px] leading-relaxed text-muted">
              Prefer email?{' '}
              <a
                href={CONTACT_MAILTO}
                className="font-medium text-brand-strong underline underline-offset-2"
              >
                Send us a message
              </a>
              .
            </p>
            <address className="mt-4 not-italic text-[15px] leading-relaxed text-muted">
              Bizzi Systems, Inc.
              <br />
              {COMPANY_ADDRESS.street}
              <br />
              Austin, Texas {COMPANY_ADDRESS.postalCode}
            </address>
          </div>
        </div>
      </Section>
    </>
  )
}

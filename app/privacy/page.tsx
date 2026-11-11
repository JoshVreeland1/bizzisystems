import type { Metadata } from 'next'
import { Container, Eyebrow, Section } from '../components/site/Container'
import { CONTACT_EMAIL, createPageMetadata } from '@/lib/site'

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'Privacy',
    description:
      'What Bizzi Systems collects through this website, how long it is kept, and why the Bizzi sensor itself collects no personal information.',
    path: '/privacy',
  }),
  robots: { index: true, follow: true },
}

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: 'What this site collects',
    body: [
      'If you submit the form on the contact page, we store what you typed into it: your name, email address, organization, the market you selected, the approximate number of spaces, and any note you added. We use it to prepare for and hold a meeting with you.',
      'Our hosting provider keeps standard server request logs, which include IP addresses, for operational and abuse-prevention purposes.',
      'This site sets no advertising or cross-site tracking cookies. It has no chat widget, no session recorder and no third-party marketing pixels.',
    ],
  },
  {
    heading: 'What the product collects',
    body: [
      'The Bizzi PS Sensor is camera-free. It reads the local magnetic field and reports whether a monitored space is occupied. It produces no image, no video, no license plate data and no vehicle identity, so there is nothing in the sensor record that identifies a person or a vehicle.',
      'The public field data shown on this site is a sanitized aggregate. It contains no hardware identifiers, no street addresses, no radio telemetry and no information about any individual.',
    ],
  },
  {
    heading: 'How it is stored and shared',
    body: [
      'Form submissions are stored in a managed database operated on our behalf by Supabase and are readable only by Bizzi staff. We do not sell personal information, and we do not share it with anyone except service providers that host this site and that database.',
    ],
  },
  {
    heading: 'How long it is kept',
    body: [
      'Contact submissions are kept while the enquiry is open and for as long as it remains commercially relevant. Ask us to delete yours and we will.',
    ],
  },
  {
    heading: 'Your choices',
    body: [
      `Write to ${CONTACT_EMAIL} to see what we hold about you, correct it, or have it deleted.`,
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <Container>
          <div className="max-w-2xl py-14 md:py-20">
            <Eyebrow>Legal</Eyebrow>
            <h1 className="mt-4 text-[34px] sm:text-[40px]">Privacy</h1>
            <p className="mt-6 text-[17px] leading-relaxed text-muted">
              Short, because this site does not do much with your data.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <div className="max-w-2xl">
          {SECTIONS.map((section) => (
            <div key={section.heading} className="border-b border-line py-8 first:pt-0">
              <h2 className="text-[20px] font-semibold text-ink">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-[16px] leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
          <p className="mt-8 text-[14px] text-muted">
            Bizzi Systems, Inc., Austin, Texas.
          </p>
        </div>
      </Section>
    </>
  )
}

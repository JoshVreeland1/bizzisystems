'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { track } from '@/lib/analytics'
import { CONTACT_EMAIL, CONTACT_MAILTO, type SchedulerConfig } from '@/lib/site'
import { MARKETS, SPACE_COUNTS } from '@/lib/contact-options'

const FIELD_BASE =
  'mt-2 block w-full rounded border border-line-strong bg-white px-3 py-2.5 text-[16px] text-ink transition-colors duration-150 placeholder:text-line-strong focus:border-brand'

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-[14px] font-medium text-ink">
      {children}
    </label>
  )
}

export default function DeploymentForm({ scheduler }: { scheduler: SchedulerConfig }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<{ message: string; field?: string } | null>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)
  const doneRef = useRef<HTMLDivElement>(null)

  const ids = {
    market: useId(),
    organization: useId(),
    size: useId(),
    note: useId(),
    name: useId(),
    email: useId(),
    error: useId(),
  }

  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])

  useEffect(() => {
    if (status === 'done') {
      doneRef.current?.focus()
      if (scheduler.mode !== 'none') track('scheduler_open')
    }
  }, [status, scheduler.mode])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setStatus('sending')

    const data = Object.fromEntries(new FormData(event.currentTarget).entries())

    try {
      const response = await fetch('/api/deployment-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = (await response.json()) as { error?: string; field?: string }

      if (!response.ok) {
        setError({ message: result.error ?? 'Something went wrong.', field: result.field })
        setStatus('idle')
        return
      }

      setStatus('done')
    } catch {
      setError({
        message: `We could not send that. Email ${CONTACT_EMAIL} and we will pick it up there.`,
      })
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <div ref={doneRef} tabIndex={-1} className="border-t border-line pt-8">
        <h2 className="text-[24px] font-semibold text-ink">That is with us.</h2>
        {scheduler.mode !== 'none' ? (
          <>
            <p className="measure mt-4 text-[16px] leading-relaxed text-muted">
              Pick a time and we will come prepared with what you just told us.
            </p>

            {scheduler.mode === 'embed' ? (
              <div className="mt-7 overflow-hidden rounded border border-line">
                <iframe
                  src={scheduler.url}
                  title="Schedule a meeting with Bizzi Systems"
                  className="h-[42rem] w-full"
                  loading="lazy"
                />
              </div>
            ) : null}

            {/* Always reachable, whether or not the frame rendered. */}
            <a
              href={scheduler.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('scheduler_open')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded bg-brand-cta px-6 py-3 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-brand-strong ${
                scheduler.mode === 'embed' ? 'mt-6' : 'mt-7'
              }`}
            >
              {scheduler.mode === 'embed' ? 'Open the booking page' : 'Pick a time'}
            </a>

            <p className="measure mt-4 text-[15px] leading-relaxed text-muted">
              Nothing suitable on the calendar?{' '}
              <a
                href={CONTACT_MAILTO}
                className="font-medium text-brand-strong underline underline-offset-2"
              >
                Send us a message
              </a>{' '}
              and we will find a time.
            </p>
          </>
        ) : (
          <>
            <p className="measure mt-4 text-[16px] leading-relaxed text-muted">
              We will reply within a business day with times, and we will have read what
              you sent before the call rather than asking you to repeat it.
            </p>
            <p className="measure mt-4 text-[16px] leading-relaxed text-muted">
              Prefer email?{' '}
              <a
                href={CONTACT_MAILTO}
                className="font-medium text-brand-strong underline underline-offset-2"
              >
                Send us a message
              </a>
              .
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="border-t border-line pt-8">
      {error ? (
        <p
          ref={errorRef}
          id={ids.error}
          tabIndex={-1}
          role="alert"
          className="mb-7 border-l-2 border-occupied bg-occupied-tint px-4 py-3 text-[15px] leading-relaxed text-occupied"
        >
          {error.message}
        </p>
      ) : null}

      <fieldset className="border-0 p-0">
        <legend className="text-[14px] font-medium text-ink">
          Which describes you best?
        </legend>
        <div className="mt-3 space-y-2.5">
          {MARKETS.map((market, index) => (
            <label
              key={market}
              className="flex cursor-pointer items-center gap-3 text-[16px] text-ink"
            >
              <input
                type="radio"
                name="market"
                value={market}
                defaultChecked={index === 0}
                required
                className="h-4 w-4 accent-[#1E4FD1]"
              />
              {market}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor={ids.organization}>Organization</Label>
          <input
            id={ids.organization}
            name="organization"
            type="text"
            required
            autoComplete="organization"
            aria-invalid={error?.field === 'organization' || undefined}
            aria-describedby={error?.field === 'organization' ? ids.error : undefined}
            className={FIELD_BASE}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor={ids.size}>Approximate number of stalls or bays</Label>
          <select
            id={ids.size}
            name="size"
            required
            defaultValue="Not sure yet"
            aria-invalid={error?.field === 'size' || undefined}
            className={FIELD_BASE}
          >
            {SPACE_COUNTS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor={ids.name}>Name</Label>
          <input
            id={ids.name}
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={error?.field === 'name' || undefined}
            aria-describedby={error?.field === 'name' ? ids.error : undefined}
            className={FIELD_BASE}
          />
        </div>

        <div>
          <Label htmlFor={ids.email}>Email</Label>
          <input
            id={ids.email}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            aria-invalid={error?.field === 'email' || undefined}
            aria-describedby={error?.field === 'email' ? ids.error : undefined}
            className={FIELD_BASE}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor={ids.note}>Anything you want us to read first (optional)</Label>
          <textarea
            id={ids.note}
            name="note"
            rows={4}
            className={`${FIELD_BASE} resize-y`}
          />
        </div>
      </div>

      {/* Bot trap. Hidden from people and from assistive technology alike. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center justify-center rounded bg-brand-cta px-6 py-3 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-brand-strong disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Request a meeting'}
        </button>
        <p className="text-[13px] text-muted">
          Six fields. We use them to prepare for the call.
        </p>
      </div>
    </form>
  )
}

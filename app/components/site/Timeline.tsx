'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export interface Milestone {
  stage: string
  heading: string
  body: string[]
  image?: {
    src: string
    alt: string
    caption: string
    aspect?: string
  }
  /** Rendered full-width beneath the text instead of beside it. */
  wideImage?: {
    src: string
    alt: string
    caption: string
    aspect?: string
  }
}

/**
 * The chronology as a vertical progress line.
 *
 * A rail runs down the node column, and a blue fill grows over it as you scroll
 * from the first milestone to the last, tracking the read position at the
 * middle of the viewport. Each node fills in as the progress reaches it. The
 * page scrolls normally; nothing is pinned or hijacked.
 *
 * Under prefers-reduced-motion, or with no JS, the rail is shown fully drawn
 * and every node active, so nothing depends on the animation to be legible.
 */
export default function Timeline({ milestones }: { milestones: Milestone[] }) {
  const containerRef = useRef<HTMLOListElement>(null)
  const nodeRefs = useRef<(HTMLElement | null)[]>([])
  const [progress, setProgress] = useState(0)
  const [activeCount, setActiveCount] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setProgress(1)
      setActiveCount(milestones.length)
      return
    }

    let frame = 0

    const measure = () => {
      frame = 0
      const nodes = nodeRefs.current.filter(Boolean) as HTMLElement[]
      if (nodes.length === 0) return

      const containerBox = container.getBoundingClientRect()
      const first = nodes[0].getBoundingClientRect()
      const last = nodes[nodes.length - 1].getBoundingClientRect()

      // Read position: the middle of the viewport.
      const marker = window.innerHeight / 2
      const top = first.top + first.height / 2
      const bottom = last.top + last.height / 2
      const span = Math.max(1, bottom - top)

      const ratio = Math.min(1, Math.max(0, (marker - top) / span))
      // Height of the fill relative to the container, so the CSS line matches.
      const fillPx = top - containerBox.top + ratio * span
      setProgress(Math.min(1, Math.max(0, fillPx / container.offsetHeight)))

      let active = 0
      for (const node of nodes) {
        const center = node.getBoundingClientRect().top + node.getBoundingClientRect().height / 2
        if (center <= marker + 4) active += 1
      }
      setActiveCount(active)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [milestones.length])

  return (
    <ol ref={containerRef} className="relative">
      {/* Rail + blue fill, aligned to the node column. */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-[7px] top-0 w-px bg-line lg:left-[calc(16.6667%_-_13.6667px)]"
      >
        <div
          className="w-full origin-top bg-brand transition-[height] duration-150 ease-out"
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      {milestones.map((milestone, index) => {
        const active = index < activeCount
        return (
          <li
            key={milestone.stage}
            ref={(el) => {
              nodeRefs.current[index] = el
            }}
            className="relative grid grid-cols-[14px_minmax(0,1fr)] gap-x-5 pb-12 last:pb-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,10fr)] lg:gap-x-10"
          >
            {/* Node dot on the rail. */}
            <span
              aria-hidden="true"
              className={`relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 bg-white transition-colors duration-200 lg:justify-self-end ${
                active ? 'border-brand' : 'border-line-strong'
              }`}
            >
              <span
                className={`absolute inset-[3px] rounded-full transition-opacity duration-200 ${
                  active ? 'bg-brand opacity-100' : 'opacity-0'
                }`}
              />
            </span>

            <div className="lg:grid lg:grid-cols-[minmax(0,6fr)_minmax(0,4fr)] lg:gap-x-10">
              <div className={milestone.image ? '' : 'lg:col-span-2'}>
                <span
                  className={`text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
                    active ? 'text-brand-strong' : 'text-muted'
                  }`}
                >
                  {milestone.stage}
                </span>
                <h3 className="mt-2 text-[20px] font-medium leading-snug text-ink lg:text-[22px]">
                  {milestone.heading}
                </h3>
                {milestone.body.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-[16px] leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}

                {milestone.wideImage ? (
                  <figure className="m-0 mt-6">
                    <div
                      className={`relative w-full overflow-hidden rounded-md border border-line bg-surface ${
                        milestone.wideImage.aspect ?? 'aspect-[16/9]'
                      }`}
                    >
                      <Image
                        src={milestone.wideImage.src}
                        alt={milestone.wideImage.alt}
                        fill
                        sizes="(min-width: 768px) 720px, 100vw"
                        className="object-cover object-left-top"
                      />
                    </div>
                    <figcaption className="mt-3 border-l-2 border-line-strong pl-3 text-[13px] leading-relaxed text-muted">
                      {milestone.wideImage.caption}
                    </figcaption>
                  </figure>
                ) : null}
              </div>

              {milestone.image ? (
                <figure className="m-0 mt-6 lg:mt-0">
                  <div
                    className={`relative w-full overflow-hidden rounded-md border border-line bg-surface ${
                      milestone.image.aspect ?? 'aspect-[4/3]'
                    }`}
                  >
                    <Image
                      src={milestone.image.src}
                      alt={milestone.image.alt}
                      fill
                      sizes="(min-width: 768px) 300px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 border-l-2 border-line-strong pl-3 text-[13px] leading-relaxed text-muted">
                    {milestone.image.caption}
                  </figcaption>
                </figure>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

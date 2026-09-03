'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { track } from '@/lib/analytics'
import { PRIMARY_CTA } from '@/lib/site'

const SIZES = {
  sm: 'px-3.5 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-[15px]',
  lg: 'px-6 py-3 text-[15px]',
} as const

const VARIANTS = {
  brand: 'bg-brand-cta text-white hover:bg-brand-strong',
  // On the navy band, white-on-blue would sit at the AA threshold. Inverting
  // it is both more legible and a stronger close.
  onDark: 'bg-white text-navy hover:bg-brand-tint',
} as const

/**
 * The site's single primary action. Same words everywhere, on purpose — a
 * visitor should recognize it in the header, mid-page and in the footer as one
 * destination rather than several.
 */
export function PrimaryCta({
  size = 'md',
  variant = 'brand',
  className = '',
  source,
  children = PRIMARY_CTA.label,
}: {
  size?: keyof typeof SIZES
  variant?: keyof typeof VARIANTS
  className?: string
  source: string
  children?: ReactNode
}) {
  return (
    <Link
      href={PRIMARY_CTA.href}
      onClick={() => track('discuss_deployment_click', { source })}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded font-semibold transition-colors duration-150 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </Link>
  )
}

export function SecondaryCta({
  href,
  children,
  onDark = false,
  className = '',
}: {
  href: string
  children: ReactNode
  onDark?: boolean
  className?: string
}) {
  const isHash = href.startsWith('#')
  const classes = `group inline-flex items-center gap-1.5 text-[15px] font-medium transition-colors duration-150 ${
    onDark
      ? 'text-brand-on-dark hover:text-white'
      : 'text-brand-strong hover:text-brand-press'
  } ${className}`

  const inner = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-150 group-hover:translate-x-0.5"
      >
        →
      </span>
    </>
  )

  return isHash ? (
    <a href={href} className={classes}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  )
}

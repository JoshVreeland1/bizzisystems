'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV } from '@/lib/site'
import { PrimaryCta } from './Cta'
import { Container } from './Container'

function isActive(pathname: string, item: { href: string; children?: { href: string }[] }) {
  if (pathname === item.href) return true
  return item.children?.some((child) => child.href === pathname) ?? false
}

function Wordmark() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2.5"
      aria-label="Bizzi Systems — home"
    >
      <Image
        src="/logo-mark.png"
        alt=""
        width={256}
        height={256}
        className="h-7 w-7"
        priority
      />
      <span className="hidden text-[17px] font-semibold tracking-[-0.02em] text-ink xs:inline">
        Bizzi Systems
      </span>
    </Link>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      aria-hidden="true"
      className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
    >
      <path
        d="M1.5 3.5 5 7l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MarketsMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const item = NAV.find((entry) => entry.children)!

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const active = isActive(pathname, item)

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-1.5 py-2 text-[15px] font-medium transition-colors duration-150 ${
          active ? 'text-ink' : 'text-muted hover:text-ink'
        }`}
      >
        {item.label}
        <Chevron open={open} />
      </button>

      <div
        id={menuId}
        hidden={!open}
        className="absolute left-1/2 top-full z-50 w-[21rem] -translate-x-1/2 pt-2"
      >
        <ul className="rounded-md border border-line bg-white py-1.5 shadow-[0_6px_24px_-12px_rgba(16,27,45,0.28)]">
          {item.children!.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className="block px-4 py-3 transition-colors duration-150 hover:bg-surface"
              >
                <span className="block text-[15px] font-medium text-ink">
                  {child.label}
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                  {child.summary}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    close()
  }, [pathname, close])

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    const { body } = document
    const previous = body.style.overflow
    body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      body.style.overflow = previous
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Wordmark />

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) =>
              item.children ? (
                <MarketsMenu key={item.label} pathname={pathname} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={`py-2 text-[15px] font-medium transition-colors duration-150 ${
                    isActive(pathname, item) ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <PrimaryCta size="sm" source="header" />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded text-ink lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                {menuOpen ? (
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M3 6h14M3 10h14M3 14h14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      <div
        id="site-menu"
        ref={panelRef}
        hidden={!menuOpen}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white lg:hidden"
      >
        <Container>
          <nav aria-label="Primary, mobile" className="py-2">
            <ul className="divide-y divide-line">
              {NAV.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <div className="py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                        {item.label}
                      </p>
                      <ul className="mt-3 space-y-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block text-[17px] font-medium text-ink"
                            >
                              {child.label}
                            </Link>
                            <p className="mt-0.5 text-[13px] leading-snug text-muted">
                              {child.summary}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? 'page' : undefined}
                      className="block py-4 text-[17px] font-medium text-ink"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="py-5">
              <PrimaryCta size="lg" source="mobile_menu" className="w-full" />
            </div>
          </nav>
        </Container>
      </div>
    </header>
  )
}

import type { ReactNode } from 'react'
import OpticalLogo from './OpticalLogo'

/** Every logo on the page goes through optical sizing (see OpticalLogo). */
export const Logo = OpticalLogo

/**
 * Organisation mark: the logo printed on the paper beside the entry that names
 * it. Greyscale at rest; colour returns when the entry (a `.group`) is hovered or
 * focused. Decorative, because the name is always printed next to it.
 */
export function OrgMark({ src, size = 'size-12' }: { src?: string | null; size?: string }) {
  if (!src) return null
  return (
    <div className={`shrink-0 ${size}`} aria-hidden>
      <Logo src={src} alt="" box="size-full" fill={0.84} surface="light" className="logo-quiet mix-blend-multiply" />
    </div>
  )
}

/** Page measure: 1280 max, 80px gutters on desktop, 20px on phones. */
export const CONTAINER = 'mx-auto w-full max-w-7xl px-5 sm:px-10 lg:px-20'

/** External link that opens in a new tab. */
export function ExtLink({ href, children, className = '', label }: {
  href?: string | null
  children: ReactNode
  className?: string
  label?: string
}) {
  if (!href) return <span className={className}>{children}</span>
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={className}>
      {children}
    </a>
  )
}

/** Underlined document link in the institutional blue. */
export function DocLink({ href, children, className = '' }: { href?: string | null; children: ReactNode; className?: string }) {
  return (
    <ExtLink href={href} className={`doc-link -my-3 py-3 text-inst hover:text-inst-strong ${className}`}>
      {children}
    </ExtLink>
  )
}

/**
 * A prospectus section: full-width hairline on top, the heading in the left
 * margin column, the content in the right nine columns.
 */
export function DocSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className={`section-anchor ${CONTAINER} py-8 lg:py-12`}>
      <div className="rule-in rule-scroll h-px bg-ink" aria-hidden />
      <div className="reveal grid gap-5 pt-5 lg:grid-cols-12 lg:gap-10 lg:pt-6">
        <h2 className="font-display text-title-lg font-semibold tracking-[-0.01em] lg:col-span-3">{title}</h2>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
  )
}

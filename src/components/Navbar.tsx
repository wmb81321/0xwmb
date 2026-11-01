import { CONTAINER } from '@/components/home/primitives'

const LINKS = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#credentials', label: 'Credentials' },
  { href: '#contact', label: 'Contact' },
]

/** Document header: issuer name left, sections and the one blue action right. */
export default function Navbar({ name, email }: { name: string; email?: string | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/92 backdrop-blur-sm">
      <div className={`${CONTAINER} flex h-16 items-center justify-between gap-6`}>
        <a href="#top" className="font-display text-base font-semibold whitespace-nowrap tracking-[-0.01em] sm:text-lg">{name}</a>
        <nav aria-label="Sections" className="flex items-center gap-8">
          <ul className="hidden items-center gap-7 text-ui text-ink-muted md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-11 items-center hover:text-ink transition-colors">{l.label}</a>
              </li>
            ))}
          </ul>
          {email && (
            <a href={`mailto:${email}`}
              className="press inline-flex min-h-11 items-center bg-inst px-5 text-ui font-medium text-paper hover:bg-inst-strong">
              Email
            </a>
          )}
        </nav>
      </div>
      <span className="read-progress absolute inset-x-0 -bottom-px h-px bg-ink" aria-hidden />
    </header>
  )
}

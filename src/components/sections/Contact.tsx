import type { PortfolioData } from '@/lib/types'
import DownloadCV from '@/components/DownloadCVNoSSR'
import { socialsOf } from '@/components/home/socials'
import { CONTAINER, ExtLink } from '@/components/home/primitives'

/** Closing band: the page's two actions as clear buttons, then the document's foot. */
export default function ContactSection({ data, year }: { data: PortfolioData; year: number }) {
  const { contact, profile } = data

  return (
    <section id="contact" className="section-anchor on-navy bg-navy text-navy-ink">
      <div className={`${CONTAINER} pt-14 pb-8 lg:pt-20`}>
        <h2 className="reveal font-display font-normal text-[clamp(2.75rem,5.6vw,var(--text-display-md))] leading-none tracking-[-0.025em]">
          Let’s talk.
        </h2>
        <p className="mt-6 max-w-xl text-lg text-navy-muted lg:text-lead">
          Open to senior product roles and consulting.
        </p>

        <div className="reveal mt-8 flex flex-col gap-3 border-t border-navy-raised pt-8 sm:flex-row sm:items-center sm:gap-4">
          {contact.email && (
            <a href={`mailto:${contact.email}`}
              className="press inline-flex min-h-13 items-center justify-center bg-paper px-7 text-ui font-medium text-navy hover:bg-navy-ink">
              Email {contact.email}
            </a>
          )}
          <DownloadCV data={data} variant="button"
            className="press min-h-13 justify-center border border-navy-muted px-7 text-ui font-medium text-navy-ink hover:border-navy-ink hover:bg-navy-raised" />
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-ui text-navy-muted">
          {socialsOf(contact).map((s) => (
            <li key={s.key}>
              <ExtLink href={s.url} className="doc-link inline-flex min-h-11 items-center hover:text-navy-ink">
                {s.label}
              </ExtLink>
            </li>
          ))}
        </ul>

        <footer className="mt-12 flex flex-col gap-2 border-t border-navy-raised pt-6 text-mono-xs text-navy-muted sm:flex-row sm:justify-between">
          <p>© {year} {profile.name}</p>
          <p>Cali, Colombia</p>
        </footer>
      </div>
    </section>
  )
}

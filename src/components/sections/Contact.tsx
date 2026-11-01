import type { PortfolioData } from '@/lib/types'
import DownloadCV from '@/components/DownloadCVNoSSR'
import { socialsOf } from '@/components/home/socials'
import { CONTAINER, ExtLink } from '@/components/home/primitives'

/** Closing band: one email, the CV as backup, then the document's foot. */
export default function ContactSection({ data, year }: { data: PortfolioData; year: number }) {
  const { contact, profile } = data

  return (
    <section id="contact" className="section-anchor on-navy bg-navy text-navy-ink">
      <div className={`${CONTAINER} pt-24 pb-10 lg:pt-32`}>
        <h2 className="font-display font-normal text-[clamp(2.75rem,5.6vw,var(--text-display-md))] leading-none tracking-[-0.025em]">
          Let’s talk.
        </h2>
        <p className="mt-6 max-w-xl text-lg text-navy-muted lg:text-lead">
          Open to senior product roles and consulting.
        </p>

        <div className="mt-12 flex flex-col gap-6 border-t border-navy-raised pt-10 lg:flex-row lg:items-end lg:justify-between">
          {contact.email && (
            <a href={`mailto:${contact.email}`}
              className="doc-link font-display text-title-lg font-semibold break-all text-navy-ink sm:text-title-xl">
              {contact.email}
            </a>
          )}
          <DownloadCV data={data} className="text-ui text-navy-ink" />
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-ui text-navy-muted">
          {socialsOf(contact).map((s) => (
            <li key={s.key}>
              <ExtLink href={s.url} className="doc-link inline-flex min-h-11 items-center hover:text-navy-ink">
                {s.label}
              </ExtLink>
            </li>
          ))}
        </ul>

        <footer className="mt-20 flex flex-col gap-2 border-t border-navy-raised pt-6 text-mono-xs text-navy-muted sm:flex-row sm:justify-between">
          <p>© {year} {profile.name}</p>
          <p>Cali, Colombia</p>
        </footer>
      </div>
    </section>
  )
}

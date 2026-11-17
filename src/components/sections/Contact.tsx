import type { PortfolioData } from '@/lib/types'
import DownloadCV from '@/components/DownloadCVNoSSR'
import { CONTAINER } from '@/components/home/primitives'

/** Closing band: the CV as one clear button (email lives in the cover's profile row), then the document's foot. */
export default function ContactSection({ data, year }: { data: PortfolioData; year: number }) {
  const { profile } = data

  return (
    <section id="contact" className="section-anchor on-navy bg-navy text-navy-ink">
      <div className={`${CONTAINER} pt-14 pb-8 lg:pt-20`}>
        <h2 className="reveal font-display font-normal text-[clamp(2.75rem,5.6vw,var(--text-display-md))] leading-none tracking-[-0.025em]">
          The full record.
        </h2>
        <p className="mt-6 max-w-xl text-lg text-navy-muted lg:text-lead">
          Open to senior product roles and consulting.
        </p>

        <div className="reveal mt-8 flex flex-col border-t border-navy-raised pt-8 sm:flex-row">
          <DownloadCV data={data} variant="button"
            className="press min-h-13 justify-center bg-paper px-7 text-ui font-medium text-navy hover:bg-navy-ink" />
        </div>

        <footer className="mt-12 flex flex-col gap-2 border-t border-navy-raised pt-6 text-mono-xs text-navy-muted sm:flex-row sm:justify-between">
          <p>© {year} {profile.name}</p>
          <p>Cali, Colombia</p>
        </footer>
      </div>
    </section>
  )
}

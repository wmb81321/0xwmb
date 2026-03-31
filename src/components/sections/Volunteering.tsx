import Image from 'next/image'
import type { Volunteering } from '@/lib/types'
import SectionHeader from '@/components/SectionHeader'

export default function VolunteeringSection({ volunteering }: { volunteering: Volunteering[] }) {
  return (
    <section>
      <SectionHeader label="Volunteering" />

      <div className="flex flex-col">
        {volunteering.map((v) => (
          <div key={v.id}
            className="flex items-center gap-3 py-2 border-b border-outline-variant/15 group hover:border-outline-variant/40 transition-colors last:border-0">
            {v.logo_url && (
              <Image src={v.logo_url} alt={v.reason} width={18} height={18}
                className="object-contain flex-shrink-0 grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-90 transition-all" />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-on-surface">{v.reason}</span>
              {v.role && <span className="text-xs text-primary-container ml-2">{v.role}</span>}
              <span className="text-xs text-outline ml-2">{v.issuer}{v.year ? ` · ${v.year}` : ''}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

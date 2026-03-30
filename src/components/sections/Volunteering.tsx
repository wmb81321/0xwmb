import Image from 'next/image'
import type { Volunteering } from '@/lib/types'
import SectionHeader from '@/components/SectionHeader'

export default function VolunteeringSection({ volunteering }: { volunteering: Volunteering[] }) {
  return (
    <section>
      <SectionHeader label="Volunteering" />

      <div className="flex flex-col gap-px">
        {volunteering.map((v) => (
          <div key={v.id}
            className="bg-surface-container-low border border-outline-variant/20 px-5 py-3 flex items-center gap-4 group hover:bg-surface-container hover:border-outline-variant/50 transition-colors">
            {v.logo_url && (
              <Image src={v.logo_url} alt={v.name} width={24} height={24}
                className="object-contain flex-shrink-0 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-on-surface truncate">{v.name}</p>
              <p className="text-xs text-on-surface-variant">
                {v.issuer}{v.year ? <span className="text-outline"> · {v.year}</span> : null}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

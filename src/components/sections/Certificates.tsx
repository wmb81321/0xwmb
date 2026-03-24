import Image from 'next/image'
import type { Certificate } from '@/lib/types'
import SectionHeader from '@/components/SectionHeader'

export default function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  return (
    <section>
      <SectionHeader label="Credentials" />

      <div className="flex flex-col gap-px">
        {certificates.map((c) => (
          <div key={c.id}
            className="bg-surface-container-low border border-outline-variant/20 px-5 py-3 flex items-center gap-4 group hover:bg-surface-container hover:border-outline-variant/50 transition-colors">
            {c.logo_url && (
              <Image src={c.logo_url} alt={c.name} width={24} height={24}
                className="object-contain flex-shrink-0 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-on-surface truncate">{c.name}</p>
              <p className="text-xs text-on-surface-variant">
                {c.issuer}{c.year ? <span className="text-outline"> · {c.year}</span> : null}
              </p>
            </div>
            {(c.website || c.linkedin) && (
              <div className="flex gap-2 flex-shrink-0">
                {c.website && (
                  <a href={c.website} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-outline hover:text-primary-container transition-colors">↗</a>
                )}
                {c.linkedin && (
                  <a href={c.linkedin} target="_blank" rel="noopener noreferrer">
                    <Image src="/socials/linkdn.png" alt="LinkedIn" width={12} height={12}
                      className="opacity-40 hover:opacity-100 transition-opacity" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

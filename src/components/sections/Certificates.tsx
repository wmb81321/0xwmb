import Image from 'next/image'
import type { Certificate } from '@/lib/types'
import SectionHeader from '@/components/SectionHeader'
import WebIcon from '@/components/WebIcon'

export default function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  return (
    <section>
      <SectionHeader label="Certification" />

      <div className="flex flex-col">
        {certificates.map((c) => (
          <div key={c.id}
            className="flex items-center gap-3 py-2 border-b border-outline-variant/15 group hover:border-outline-variant/40 transition-colors last:border-0">
            {c.logo_url && (
              <Image src={c.logo_url} alt={c.name} width={18} height={18}
                className="object-contain flex-shrink-0 grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-90 transition-all" />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-on-surface">{c.name}</span>
              <span className="text-xs text-outline ml-2">{c.issuer}{c.year ? ` · ${c.year}` : ''}</span>
            </div>
            {(c.website || c.linkedin) && (
              <div className="flex gap-2 flex-shrink-0">
                {c.website && (
                  <a href={c.website} target="_blank" rel="noopener noreferrer"
                    className="text-outline hover:text-primary-container transition-colors">
                    <WebIcon size={11} />
                  </a>
                )}
                {c.linkedin && (
                  <a href={c.linkedin} target="_blank" rel="noopener noreferrer">
                    <Image src="/socials/linkdn.png" alt="LinkedIn" width={11} height={11}
                      className="opacity-30 hover:opacity-90 transition-opacity" />
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

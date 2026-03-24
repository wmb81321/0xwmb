import Image from 'next/image'
import type { Certificate } from '@/lib/types'

export default function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  return (
    <section className="py-12 px-6 max-w-5xl mx-auto border-t border-border">
      <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-6">Certificates</h2>
      <div className="flex flex-wrap gap-4">
        {certificates.map((c) => (
          <div key={c.id} className="flex items-center gap-3 bg-surface border border-border rounded px-3 py-2">
            {c.logo_url && (
              <Image src={c.logo_url} alt={c.name} width={24} height={24} className="object-contain" />
            )}
            <div>
              <p className="text-xs font-medium">{c.name}</p>
              <p className="text-xs text-muted">{c.issuer} · {c.year}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {c.website && (
                  <a href={c.website} target="_blank" rel="noopener noreferrer" title="Website"
                    className="text-xs font-mono text-muted hover:text-accent transition-colors">↗</a>
                )}
                {c.linkedin && (
                  <a href={c.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <Image src="/socials/linkdn.png" alt="LinkedIn" width={12} height={12} className="opacity-50 hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {c.twitter && (
                  <a href={c.twitter} target="_blank" rel="noopener noreferrer" title="X / Twitter">
                    <Image src="/socials/x.png" alt="X" width={12} height={12} className="opacity-50 hover:opacity-100 transition-opacity" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

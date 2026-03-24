import Image from 'next/image'
import type { Experience } from '@/lib/types'

function SocialLinks({ website, linkedin, twitter }: { website?: string; linkedin?: string; twitter?: string }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      {website && (
        <a href={website} target="_blank" rel="noopener noreferrer" title="Website"
          className="text-xs font-mono text-muted hover:text-accent transition-colors">↗</a>
      )}
      {linkedin && (
        <a href={linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
          <Image src="/socials/linkdn.png" alt="LinkedIn" width={14} height={14} className="opacity-50 hover:opacity-100 transition-opacity" />
        </a>
      )}
      {twitter && (
        <a href={twitter} target="_blank" rel="noopener noreferrer" title="X / Twitter">
          <Image src="/socials/x.png" alt="X" width={14} height={14} className="opacity-50 hover:opacity-100 transition-opacity" />
        </a>
      )}
    </div>
  )
}

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="section-anchor py-12 px-6 max-w-5xl mx-auto border-t border-border">
      <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-8">Experience</h2>
      <div className="flex flex-col gap-8">
        {experiences.map((exp) => (
          <div key={exp.id} className="flex gap-4">
            {exp.logo_url && (
              <Image src={exp.logo_url} alt={exp.company} width={40} height={40}
                className="rounded border border-border object-contain flex-shrink-0 mt-1 bg-surface p-1" />
            )}
            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <div>
                  <span className="font-semibold text-text">{exp.role}</span>
                  <span className="text-text-dim"> — </span>
                  <a href={exp.website} target="_blank" rel="noopener noreferrer"
                    className="text-text-dim hover:text-accent transition-colors">{exp.company}</a>
                </div>
                <span className="text-xs font-mono text-muted flex-shrink-0">{exp.years}</span>
              </div>
              <SocialLinks linkedin={exp.linkedin} twitter={exp.twitter} />
              <ul className="mt-2 flex flex-col gap-1">
                {exp.points.map((pt, i) => (
                  <li key={i} className="text-sm text-text-dim flex gap-2">
                    <span className="text-accent mt-1 flex-shrink-0">·</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

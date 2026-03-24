import Image from 'next/image'
import type { Skill } from '@/lib/types'

function SkillTag({ name, logoUrl }: { name: string; logoUrl?: string }) {
  return (
    <span className="flex items-center gap-1 text-xs font-mono bg-surface-2 border border-border px-2 py-0.5 rounded text-text-dim">
      {logoUrl && (
        <Image src={logoUrl} alt={name} width={12} height={12} className="object-contain opacity-80" />
      )}
      {name}
    </span>
  )
}

function SkillGroup({ skills }: { skills: Skill[] }) {
  return (
    <div className="flex flex-col gap-4">
      {skills.map((sk) => (
        <div key={sk.id}>
          <p className="text-xs text-text-dim font-medium mb-1">{sk.category}</p>
          <div className="flex flex-wrap gap-1.5">
            {sk.items.map((item) => (
              <SkillTag key={item} name={item} logoUrl={sk.logos?.[item]} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const technical = skills.filter((sk) => sk.type === 'technical')
  const soft = skills.filter((sk) => sk.type === 'soft')

  return (
    <section id="skills" className="section-anchor py-12 px-6 max-w-5xl mx-auto border-t border-border">
      <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-8">Skills</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xs font-mono text-muted uppercase tracking-wider mb-4">Tooling</h3>
          <SkillGroup skills={technical} />
        </div>
        <div>
          <h3 className="text-xs font-mono text-muted uppercase tracking-wider mb-4">Core Competencies</h3>
          <SkillGroup skills={soft} />
        </div>
      </div>
    </section>
  )
}

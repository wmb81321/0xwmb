import type { Skill } from '@/lib/types'

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const technical = skills.filter((sk) => sk.type === 'technical')
  const soft = skills.filter((sk) => sk.type === 'soft')

  return (
    <section id="skills" className="section-anchor py-12 px-6 max-w-5xl mx-auto border-t border-border">
      <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-8">Skills</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xs font-mono text-muted uppercase tracking-wider mb-4">Tooling</h3>
          <div className="flex flex-col gap-4">
            {technical.map((sk) => (
              <div key={sk.id}>
                <p className="text-xs text-text-dim font-medium mb-1">{sk.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {sk.items.map((item) => (
                    <span key={item} className="text-xs font-mono bg-surface-2 border border-border px-2 py-0.5 rounded text-text-dim">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-mono text-muted uppercase tracking-wider mb-4">Core Competencies</h3>
          <div className="flex flex-col gap-4">
            {soft.map((sk) => (
              <div key={sk.id}>
                <p className="text-xs text-text-dim font-medium mb-1">{sk.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {sk.items.map((item) => (
                    <span key={item} className="text-xs font-mono bg-surface-2 border border-border px-2 py-0.5 rounded text-text-dim">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

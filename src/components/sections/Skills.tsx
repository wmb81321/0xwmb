import Image from 'next/image'
import type { Skill } from '@/lib/types'
import SectionHeader from '@/components/SectionHeader'

function SkillTag({ name, logoUrl }: { name: string; logoUrl?: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-container px-2 py-1 border border-outline-variant/20 hover:border-primary-container/40 hover:text-primary transition-colors">
      {logoUrl && (
        <Image src={logoUrl} alt={name} width={11} height={11} className="object-contain opacity-70" />
      )}
      {name}
    </span>
  )
}

function SkillGroup({ title, skills }: { title: string; skills: Skill[] }) {
  return (
    <div>
      <SectionHeader label={title} />
      <div className="flex flex-col gap-6">
        {skills.map((sk) => (
          <div key={sk.id}>
            <p className="text-xs text-outline tracking-[0.15em] uppercase mb-2">{sk.category}</p>
            <div className="flex flex-wrap gap-1.5">
              {sk.items.map((item) => (
                <SkillTag key={item} name={item} logoUrl={sk.logos?.[item]} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const technical = skills.filter((s) => s.type === 'technical')
  const soft = skills.filter((s) => s.type === 'soft')

  return (
    <>
      {technical.length > 0 && <SkillGroup title="Technical_Grid" skills={technical} />}
      {soft.length > 0 && <SkillGroup title="Core_Competencies" skills={soft} />}
    </>
  )
}

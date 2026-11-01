import type { Skill } from '@/lib/types'
import { DocSection } from '@/components/home/primitives'

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null
  return (
    <DocSection id="capabilities" title="Capabilities">
      <dl>
        {skills.map((s, i) => (
          <div key={s.id} className={`grid gap-2 py-4 md:grid-cols-9 md:gap-10 ${i > 0 ? 'border-t border-rule' : 'pt-0'}`}>
            <dt className="text-ui font-semibold md:col-span-2">{s.category}</dt>
            <dd className="text-ink-muted md:col-span-7">{s.items.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </DocSection>
  )
}

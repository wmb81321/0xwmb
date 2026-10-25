// Placeholder for sections whose tables land in Phase 1+. Lists what the section will hold.
export default function ComingSoon({ title, phase, items }: { title: string; phase: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="flex items-center gap-4 text-4xl font-semibold tracking-tight text-primary">
        <span className="data-pulse" />
        {title}
      </h1>
      <div className="bg-surface-container-low p-6 flex flex-col gap-4 max-w-2xl">
        <div className="font-mono text-xs tracking-[0.08em] text-tertiary-container">◌ NOT YET ONLINE · {phase}</div>
        <ul className="flex flex-col gap-0.5 font-mono text-sm">
          {items.map((i) => (
            <li key={i} className="bg-surface-container px-3 py-2.5 text-on-surface-variant">{i}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

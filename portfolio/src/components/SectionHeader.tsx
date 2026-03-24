export default function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      <div className="data-pulse flex-shrink-0" />
      <span className="text-xs tracking-[0.2em] text-on-surface-variant uppercase">
        {label}
      </span>
    </div>
  )
}

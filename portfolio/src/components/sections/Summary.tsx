export default function Summary({ text }: { text: string }) {
  return (
    <section className="py-12 px-6 max-w-5xl mx-auto border-t border-border">
      <h2 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-4">Professional Summary</h2>
      <p className="text-text-dim leading-relaxed max-w-3xl">{text}</p>
    </section>
  )
}

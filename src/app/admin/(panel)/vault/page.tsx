export const dynamic = 'force-dynamic'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

// Every private document (invoices and uploads), newest first, with 5-minute signed links.
// Access is already gated by the panel layout (owner + strong session).
export default async function VaultPage() {
  const storage = createAdminSupabaseClient().storage.from('personal-docs')
  const { data: folders } = await storage.list('', { limit: 100 })
  const files = (await Promise.all((folders ?? []).filter((f) => !f.id).map(async (folder) => {
    const { data } = await storage.list(folder.name, { limit: 500, sortBy: { column: 'created_at', order: 'desc' } })
    return (data ?? []).filter((f) => f.id).map((f) => ({ path: `${folder.name}/${f.name}`, folder: folder.name, created: f.created_at, size: f.metadata?.size as number | undefined }))
  }))).flat().sort((a, b) => String(b.created).localeCompare(String(a.created)))
  const { data: signed } = files.length ? await storage.createSignedUrls(files.map((f) => f.path), 300) : { data: [] }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <h1 className="flex items-center gap-4 text-4xl font-semibold tracking-tight text-primary">
        <span className="data-pulse" />Vault
      </h1>
      <p className="font-mono text-xs text-outline">{files.length} private documents · links expire after 5 minutes</p>
      <ul className="flex flex-col gap-0.5">
        {files.map((f, i) => (
          <li key={f.path} className="bg-surface-container-low px-4 py-3 flex items-center justify-between gap-4 font-mono text-sm">
            <span className="truncate text-on-surface">📎 {f.path}</span>
            <span className="text-outline text-xs shrink-0">{String(f.created).slice(0, 10)}{f.size ? ` · ${Math.round(f.size / 1024)} KB` : ''}</span>
            {signed?.[i]?.signedUrl && <a href={signed[i].signedUrl} target="_blank" rel="noopener" className="text-primary-container text-xs shrink-0">OPEN ↗</a>}
          </li>
        ))}
      </ul>
    </div>
  )
}

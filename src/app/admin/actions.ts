'use server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const admin = () => createAdminSupabaseClient()

// Only these tables can be written through the generic actions.
const WRITABLE_TABLES = new Set([
  'profile', 'experiences', 'projects', 'education', 'certificates', 'volunteering',
  'achievements', 'skills', 'languages', 'contact', 'job_applications',
  'personal_tasks', 'personal_affiliations', 'personal_accounts', 'personal_subscriptions', 'personal_debts',
  'personal_phone_lines', 'personal_emails', 'personal_account_links', 'personal_entities',
])
const isPublicTable = (table: string) => !table.startsWith('personal_')

const IMAGE_TYPES: Record<string, string> = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/gif': 'gif',
}
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

function assertWritable(table: string) {
  if (!WRITABLE_TABLES.has(table)) throw new Error(`Table not allowed: ${table}`)
}

export async function uploadLogo(formData: FormData): Promise<string> {
  await requireRole(['owner'])
  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')
  const ext = IMAGE_TYPES[file.type]
  if (!ext) throw new Error('Unsupported file type')
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('File too large (max 5MB)')
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const bytes = await file.arrayBuffer()
  const { error } = await admin()
    .storage.from('portfolio-assets')
    .upload(path, bytes, { contentType: file.type, upsert: false })
  if (error) throw new Error(error.message)
  const { data } = admin().storage.from('portfolio-assets').getPublicUrl(path)
  return data.publicUrl
}

export async function upsertRecord(table: string, data: Record<string, unknown>) {
  await requireRole(['owner'])
  assertWritable(table)
  const { error } = await admin().from(table).upsert(data)
  if (error) throw new Error(error.message)
  if (isPublicTable(table)) revalidatePath('/')
  revalidatePath('/admin', 'layout')
}

export async function deleteRecord(table: string, id: number) {
  await requireRole(['owner'])
  assertWritable(table)
  const { error } = await admin().from(table).delete().eq('id', id)
  if (error) throw new Error(error.message)
  if (isPublicTable(table)) revalidatePath('/')
  revalidatePath('/admin', 'layout')
}

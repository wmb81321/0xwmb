'use server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

const admin = () => createAdminSupabaseClient()

export async function uploadLogo(formData: FormData): Promise<string> {
  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')
  const ext = file.name.split('.').pop()
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
  const { error } = await admin().from(table).upsert(data)
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteRecord(table: string, id: number) {
  const { error } = await admin().from(table).delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin')
}

'use server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

const admin = () => createAdminSupabaseClient()

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

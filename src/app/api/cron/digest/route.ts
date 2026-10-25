import { NextResponse, type NextRequest } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { sendMessage } from '@/lib/telegram'
import { buildDigest } from '@/lib/digest'

// Vercel Cron (vercel.json) at 12:00 UTC = 07:00 America/Bogota. Vercel sends `Authorization: Bearer $CRON_SECRET`.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return new NextResponse('unauthorized', { status: 401 })
  }
  const chatId = Number(process.env.TELEGRAM_OWNER_ID)
  if (!chatId) return new NextResponse('no owner', { status: 503 })

  const text = await buildDigest()
  await sendMessage(chatId, text)
  // Kept in Jarvis's conversation so a reply like "marca la primera como hecha" has context.
  await createAdminSupabaseClient().from('personal_agent_messages').insert({ chat_id: chatId, role: 'assistant', content: { text } })
  return NextResponse.json({ ok: true, chars: text.length })
}

import { after, NextResponse, type NextRequest } from 'next/server'
import type Anthropic from '@anthropic-ai/sdk'
import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { answerCallback, downloadFile, editMessage, sendMessage, sendTyping } from '@/lib/telegram'
import { runJarvis } from '@/lib/jarvis/agent'
import { routeMessage } from '@/lib/jarvis/router'
import { applyProposal, rejectProposal } from '@/lib/jarvis/tools'

export const maxDuration = 300

type TgUser = { id: number }
type TgFile = { file_id: string; file_size?: number; mime_type?: string; file_name?: string }
type TgMessage = {
  message_id: number; chat: { id: number; type: string }; from?: TgUser
  text?: string; caption?: string; document?: TgFile; photo?: TgFile[]
}
type TgUpdate = {
  update_id: number
  message?: TgMessage
  callback_query?: { id: string; from: TgUser; data?: string; message?: { message_id: number; chat: { id: number }; text?: string } }
}

const MAX_FILE = 20 * 1024 * 1024
const DOC_MIME: Record<string, string> = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

// Telegram webhook. Only William's Telegram account is served; everyone else is ignored silently.
export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (!secret || req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
    return new NextResponse('forbidden', { status: 403 })
  }
  const owner = Number(process.env.TELEGRAM_OWNER_ID)
  const update = (await req.json()) as TgUpdate
  const from = update.message?.from?.id ?? update.callback_query?.from.id
  if (!owner || from !== owner) return NextResponse.json({ ok: true })

  // Answer Telegram immediately; the agent runs after the response is sent.
  after(() => handle(update).catch(async (e) => {
    console.error('[jarvis]', e)
    const chatId = update.message?.chat.id ?? update.callback_query?.message?.chat.id
    if (chatId) await sendMessage(chatId, `⚠️ Something failed: ${String(e).slice(0, 300)}`).catch(() => {})
  }))
  return NextResponse.json({ ok: true })
}

async function handle(update: TgUpdate) {
  const cb = update.callback_query
  if (cb?.data && cb.message) {
    const [action, raw] = cb.data.split(':')
    const id = Number(raw)
    const chatId = cb.message.chat.id
    const result = action === 'ok' ? await applyProposal(id, chatId) : await rejectProposal(id, chatId)
    await answerCallback(cb.id, result.slice(0, 190))
    await editMessage(chatId, cb.message.message_id, result)
    await createAdminSupabaseClient().from('personal_agent_messages').insert([
      { chat_id: chatId, role: 'user', content: { text: `[tapped ${action === 'ok' ? 'Confirm' : 'Discard'} on proposal #${id}]` } },
      { chat_id: chatId, role: 'assistant', content: { text: result } },
    ])
    return
  }

  const msg = update.message
  if (!msg || msg.chat.type !== 'private') return
  const chatId = msg.chat.id
  const text = (msg.text ?? msg.caption ?? '').trim()

  if (text === '/start') {
    await sendMessage(chatId, 'Jarvis online. Tell me about a payment, a subscription, a debt — or send an invoice (PDF or photo).')
    return
  }

  await sendTyping(chatId)
  const blocks: Anthropic.Beta.BetaContentBlockParam[] = []
  let logText = text

  const file = msg.document ?? msg.photo?.at(-1)
  if (file) {
    if ((file.file_size ?? 0) > MAX_FILE) return sendMessage(chatId, 'That file is over 20MB — please send a smaller one.')
    const mime = msg.document?.mime_type ?? 'image/jpeg'
    const ext = DOC_MIME[mime]
    if (!ext) return sendMessage(chatId, 'I can read PDFs and images (JPG, PNG, WebP).')

    const { bytes } = await downloadFile(file.file_id)
    const path = `invoices/${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 10)}.${ext}`
    const { error } = await createAdminSupabaseClient().storage.from('personal-docs')
      .upload(path, bytes, { contentType: mime, upsert: false })
    if (error) throw new Error(`Storing file: ${error.message}`)

    const data = Buffer.from(bytes).toString('base64')
    blocks.push(mime === 'application/pdf'
      ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } }
      : { type: 'image', source: { type: 'base64', media_type: mime as 'image/jpeg' | 'image/png' | 'image/webp', data } })
    blocks.push({ type: 'text', text: `[uploaded file stored at personal-docs path: ${path}]` })
    logText = `${text} [sent file ${msg.document?.file_name ?? 'photo'} → ${path}]`.trim()
  }
  if (text) blocks.push({ type: 'text', text })
  if (!blocks.length) return

  // Jev decides how much model this needs (small talk and simple turns → Haiku, the rest → Opus).
  const decision = await routeMessage(text, Boolean(file))
  const { text: reply, proposals } = await runJarvis(chatId, blocks, logText, decision)
  await sendMessage(chatId, reply)
  for (const p of proposals) {
    await sendMessage(chatId, `📝 ${p.summary}`, [[
      { text: '✅ Confirm', callback_data: `ok:${p.id}` },
      { text: '✖ Discard', callback_data: `no:${p.id}` },
    ]])
  }
}

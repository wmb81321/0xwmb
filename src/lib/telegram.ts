// Minimal Telegram Bot API client (server-only). Token comes from TELEGRAM_BOT.
const token = () => {
  const t = process.env.TELEGRAM_BOT
  if (!t) throw new Error('TELEGRAM_BOT is not set')
  return t
}

async function call<T = unknown>(method: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${token()}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = (await res.json()) as { ok: boolean; result: T; description?: string }
  if (!json.ok) throw new Error(`Telegram ${method}: ${json.description}`)
  return json.result
}

export type InlineButton = { text: string; callback_data: string }

// Telegram caps messages at 4096 chars; split long replies on line breaks.
export async function sendMessage(chatId: number, text: string, buttons?: InlineButton[][]) {
  const chunks: string[] = []
  let rest = text || '…'
  while (rest.length > 4000) {
    const cut = rest.lastIndexOf('\n', 4000) > 1000 ? rest.lastIndexOf('\n', 4000) : 4000
    chunks.push(rest.slice(0, cut))
    rest = rest.slice(cut)
  }
  chunks.push(rest)
  for (const [i, chunk] of chunks.entries()) {
    const last = i === chunks.length - 1
    await call('sendMessage', {
      chat_id: chatId,
      text: chunk,
      ...(last && buttons ? { reply_markup: { inline_keyboard: buttons } } : {}),
    })
  }
}

export const sendTyping = (chatId: number) => call('sendChatAction', { chat_id: chatId, action: 'typing' }).catch(() => {})

export const editMessage = (chatId: number, messageId: number, text: string) =>
  call('editMessageText', { chat_id: chatId, message_id: messageId, text }).catch(() => {})

export const answerCallback = (id: string, text?: string) => call('answerCallbackQuery', { callback_query_id: id, text }).catch(() => {})

// Downloads a file the user sent (document/photo) as bytes.
export async function downloadFile(fileId: string): Promise<{ bytes: ArrayBuffer; path: string }> {
  const file = await call<{ file_path: string }>('getFile', { file_id: fileId })
  const res = await fetch(`https://api.telegram.org/file/bot${token()}/${file.file_path}`)
  if (!res.ok) throw new Error(`Telegram file download failed: ${res.status}`)
  return { bytes: await res.arrayBuffer(), path: file.file_path }
}

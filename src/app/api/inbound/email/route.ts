import { after, NextResponse, type NextRequest } from 'next/server'
import { Resend } from 'resend'
import { processInbound } from '@/lib/inbox/process'

export const maxDuration = 300

// Resend webhook for email.received. The signature (Svix headers over the raw body) is verified
// before anything is trusted; the email itself is fetched from Resend's API, never taken from the payload.
export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) return new NextResponse('not configured', { status: 503 })

  const payload = await req.text()
  let event: { type: string; data?: { email_id?: string } }
  try {
    event = new Resend(process.env.RESEND_API_KEY).webhooks.verify({
      payload,
      headers: {
        id: req.headers.get('svix-id') ?? '',
        timestamp: req.headers.get('svix-timestamp') ?? '',
        signature: req.headers.get('svix-signature') ?? '',
      },
      webhookSecret: secret,
    }) as typeof event
  } catch {
    return new NextResponse('invalid signature', { status: 401 })
  }

  const emailId = event.type === 'email.received' ? event.data?.email_id : undefined
  if (emailId) {
    after(() => processInbound(emailId).catch((e) => console.error('[inbox]', emailId, e)))
  }
  return NextResponse.json({ ok: true })
}

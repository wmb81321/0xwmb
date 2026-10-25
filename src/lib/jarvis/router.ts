// Jev (Typesafe System One) pre-router: decides how much model a Telegram message needs
// before any Claude call. Messages with files skip Jev and go straight to the strong model.

export type Route = 'smalltalk' | 'simple' | 'complex'
export const TOPICS = {
  payment: 'Reports a payment or charge that already happened',
  invoice: 'An invoice, receipt or statement to store',
  subscription: 'A subscription or recurring bill: new, price change, cancellation',
  debt: 'A loan or debt such as ICETEX or a credit card',
  account: 'A bank, exchange, fintech or card account',
  social_security: 'Health (EPS), pension, cesantías, ARL',
  identity: 'Emails, phone lines, logins, 2FA, passwords, identity documents',
  company: 'One of his companies: Ekinoxis Labs, Echosystem Technologies, the US LLC',
  tax: 'Taxes: DIAN, RUT, declaración de renta, IRS, ITIN, US filings',
  job_application: 'A job opportunity or application',
  task: 'A to-do, reminder or deadline',
  question: 'Asks for a summary, total or status of existing data',
  other: 'Anything else',
} as const
export type Topic = keyof typeof TOPICS
export interface RouteDecision { route: Route; confidence: number | null; topic: Topic | null; jevTokens: number }

const SMALLTALK_MIN = 0.9 // only skip Claude when Jev is very sure
const SIMPLE_MIN = 0.7
const TOPIC_MIN = 0.6 // below this the topic hint is omitted rather than risk misleading Claude

export async function routeMessage(text: string, hasFile: boolean): Promise<RouteDecision> {
  if (hasFile) return { route: 'complex', confidence: null, topic: 'invoice', jevTokens: 0 }
  const key = process.env.TYPESAFE_API_KEY
  if (!key || !text.trim()) return { route: 'complex', confidence: null, topic: null, jevTokens: 0 }

  try {
    const res = await fetch('https://api.typesafe.ai/v1/systemone', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000),
      body: JSON.stringify({
        model: 'jev-latest',
        state: text.slice(0, 2000),
        questions: {
          route: {
            type: 'choice',
            instructions: 'How should a personal finance and admin assistant handle this chat message',
            criteria: {
              smalltalk: 'Greeting, thanks or acknowledgement with no request and no new information',
              simple: 'One clear request, one question, or one fact to record',
              complex: 'Several items or payments, documents, calculations, planning, or an ambiguous request',
            },
          },
          // Asked in the same call (speculative fan-out): no extra latency.
          topic: { type: 'choice', instructions: 'What is this message mainly about', criteria: TOPICS },
        },
      }),
    })
    if (!res.ok) throw new Error(`Jev ${res.status}`)
    const json = (await res.json()) as {
      answers?: { route?: { choice?: Route; confidence?: number }; topic?: { choice?: Topic; confidence?: number } }
      usage?: { input_tokens?: number; output_tokens?: number }
    }
    const choice = json.answers?.route?.choice
    const confidence = json.answers?.route?.confidence ?? 0
    const jevTokens = (json.usage?.input_tokens ?? 0) + (json.usage?.output_tokens ?? 0)
    const t = json.answers?.topic
    const topic = t?.choice && (t.confidence ?? 0) >= TOPIC_MIN ? t.choice : null

    if (choice === 'smalltalk' && confidence >= SMALLTALK_MIN) return { route: 'smalltalk', confidence, topic, jevTokens }
    if (choice === 'simple' && confidence >= SIMPLE_MIN) return { route: 'simple', confidence, topic, jevTokens }
    // Unsure or complex → strong model.
    return { route: 'complex', confidence, topic, jevTokens }
  } catch (e) {
    console.error('[jarvis] jev routing failed, using complex route', e)
    return { route: 'complex', confidence: null, topic: null, jevTokens: 0 }
  }
}

import { randomUUID } from 'node:crypto'

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { askKnowledgeBase } from '@/lib/rag/runtime'

export const runtime = 'nodejs'

const requestSchema = z.object({
  question: z.string().trim().min(3).max(500)
})

function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  })
}

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = randomUUID()

  try {
    const payload = requestSchema.safeParse(await request.json())
    if (!payload.success) {
      return json({ error: 'Question must contain between 3 and 500 characters.', requestId }, 400)
    }

    const result = await askKnowledgeBase(payload.data.question)
    return json({ ...result, requestId })
  } catch (error) {
    console.error('Grounded answer request failed', {
      requestId,
      errorType: error instanceof Error ? error.name : 'UnknownError'
    })
    return json({ error: 'The grounded answer service is temporarily unavailable.', requestId }, 503)
  }
}

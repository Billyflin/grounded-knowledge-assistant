'use client'

import { FormEvent, useState } from 'react'

import type { RagResult } from '@/lib/rag/types'

type ApiResult = RagResult & { requestId: string }

const EXAMPLES = [
  'What triggers a canary rollback?',
  'How does inventory reservation avoid reducing stock twice?',
  'What is the response target for a P1 incident?',
  "What is the CEO's favorite color?"
]

export function AskPanel({ mode }: { mode: string }) {
  const [question, setQuestion] = useState(EXAMPLES[0])
  const [result, setResult] = useState<ApiResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'The request could not be completed.')
      }

      setResult(payload)
    } catch (cause) {
      setResult(null)
      setError(cause instanceof Error ? cause.message : 'The request could not be completed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="ask-panel" aria-labelledby="ask-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Live retrieval path</p>
          <h2 id="ask-title">Ask the operations handbook</h2>
        </div>
        <span className="mode-chip">{mode}</span>
      </div>

      <form onSubmit={submit}>
        <label htmlFor="question">Question</label>
        <div className="question-row">
          <textarea
            id="question"
            name="question"
            rows={3}
            minLength={3}
            maxLength={500}
            value={question}
            onChange={event => setQuestion(event.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || question.trim().length < 3}>
            {loading ? 'Retrieving…' : 'Ask with evidence'}
          </button>
        </div>
      </form>

      <div className="example-list" aria-label="Example questions">
        {EXAMPLES.map(example => (
          <button key={example} type="button" onClick={() => setQuestion(example)} disabled={loading}>
            {example}
          </button>
        ))}
      </div>

      <div className="answer-region" aria-live="polite" aria-busy={loading}>
        {error && <p className="error-message">{error}</p>}
        {!error && !result && (
          <p className="empty-state">The answer will appear here with validated source markers and retrieval scores.</p>
        )}
        {result && (
          <article className={result.supported ? 'answer-card' : 'answer-card answer-card--refusal'}>
            <div className="answer-meta">
              <span>{result.supported ? 'Grounded answer' : 'Safe refusal'}</span>
              <span>provider: {result.provider}</span>
            </div>
            <p className="answer-text">{result.answer}</p>

            {result.sources.length > 0 && (
              <ol className="source-list">
                {result.sources.map(source => (
                  <li key={`${source.citation}-${source.documentId}`}>
                    <div>
                      <strong>[{source.citation}] {source.title}</strong>
                      <span>retrieval score {source.score.toFixed(3)}</span>
                    </div>
                    <p>{source.excerpt}</p>
                    <a href={source.url}>Inspect source document →</a>
                  </li>
                ))}
              </ol>
            )}
          </article>
        )}
      </div>
    </section>
  )
}

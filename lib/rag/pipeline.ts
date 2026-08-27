import { retrieve, type RagIndex } from './retriever'
import { truncate } from './text'
import { validateCitations } from './citations'
import type {
  AnswerProvider,
  EmbeddingProvider,
  RagResult,
  RagSource
} from './types'

export const REFUSAL = 'I do not have enough grounded evidence in the indexed sources to answer that question.'

type RunRagOptions = {
  question: string
  index: RagIndex
  embedder: EmbeddingProvider
  answerer: AnswerProvider
  provider: 'local' | 'openai'
  minScore?: number
  topK?: number
}

export async function runRag({
  question,
  index,
  embedder,
  answerer,
  provider,
  minScore = 0.11,
  topK = 3
}: RunRagOptions): Promise<RagResult> {
  const retrieved = await retrieve(index, question, embedder, topK)
  const topScore = retrieved[0]?.score ?? null

  if (topScore === null || topScore < minScore) {
    return {
      answer: REFUSAL,
      supported: false,
      provider,
      sources: [],
      diagnostics: {
        topScore,
        citationValid: true,
        refusalReason: 'insufficient_retrieval'
      }
    }
  }

  const sources: RagSource[] = retrieved.map((chunk, index) => ({
    citation: `S${index + 1}`,
    documentId: chunk.documentId,
    title: chunk.title,
    url: chunk.url,
    excerpt: truncate(chunk.text, 560),
    score: Number(chunk.score.toFixed(4))
  }))
  const answer = await answerer.answer(question, sources)
  const citationValid = answer === REFUSAL || validateCitations(answer, sources)

  if (answer === REFUSAL) {
    return {
      answer: REFUSAL,
      supported: false,
      provider,
      sources: [],
      diagnostics: {
        topScore,
        citationValid: true,
        refusalReason: 'answer_refusal'
      }
    }
  }

  if (!citationValid) {
    return {
      answer: REFUSAL,
      supported: false,
      provider,
      sources: [],
      diagnostics: {
        topScore,
        citationValid: false,
        refusalReason: 'invalid_citations'
      }
    }
  }

  return {
    answer,
    supported: true,
    provider,
    sources,
    diagnostics: {
      topScore,
      citationValid
    }
  }
}

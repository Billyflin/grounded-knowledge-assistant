import { knowledgeDocuments } from '@/data/knowledge'

import { LocalAnswerProvider } from './local-answer'
import { LocalEmbeddingProvider } from './local-embedding'
import { OpenAIAnswerProvider, OpenAIEmbeddingProvider } from './openai-provider'
import { runRag } from './pipeline'
import { buildIndex, type RagIndex } from './retriever'
import type { AnswerProvider, EmbeddingProvider, RagResult } from './types'

type Runtime = {
  provider: 'local' | 'openai'
  embedder: EmbeddingProvider
  answerer: AnswerProvider
  index: RagIndex
}

let runtimePromise: Promise<Runtime> | undefined

async function createRuntime(): Promise<Runtime> {
  const useOpenAI = process.env.RAG_PROVIDER === 'openai'
  const apiKey = process.env.OPENAI_API_KEY

  if (useOpenAI && !apiKey) {
    throw new Error('RAG_PROVIDER=openai requires OPENAI_API_KEY')
  }

  const provider = useOpenAI ? 'openai' : 'local'
  const embedder: EmbeddingProvider = useOpenAI
    ? new OpenAIEmbeddingProvider(apiKey!, process.env.OPENAI_EMBEDDING_MODEL)
    : new LocalEmbeddingProvider()
  const answerer: AnswerProvider = useOpenAI
    ? new OpenAIAnswerProvider(apiKey!, process.env.OPENAI_MODEL)
    : new LocalAnswerProvider()
  const index = await buildIndex(knowledgeDocuments, embedder)

  return { provider, embedder, answerer, index }
}

export async function askKnowledgeBase(question: string): Promise<RagResult> {
  runtimePromise ??= createRuntime()
  const runtime = await runtimePromise

  return runRag({
    question,
    index: runtime.index,
    embedder: runtime.embedder,
    answerer: runtime.answerer,
    provider: runtime.provider
  })
}

export function resetRuntimeForTests(): void {
  runtimePromise = undefined
}

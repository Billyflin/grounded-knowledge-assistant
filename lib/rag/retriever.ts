import { chunkDocuments } from './chunk'
import type {
  EmbeddingProvider,
  IndexedChunk,
  KnowledgeDocument,
  RetrievedChunk
} from './types'

export type RagIndex = {
  chunks: IndexedChunk[]
}

export function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length !== right.length) throw new Error('Embedding dimensions must match')
  return left.reduce((score, value, index) => score + value * right[index], 0)
}

export async function buildIndex(
  documents: KnowledgeDocument[],
  embedder: EmbeddingProvider
): Promise<RagIndex> {
  const chunks = chunkDocuments(documents)
  const embeddings = await embedder.embed(chunks.map(chunk => `${chunk.title}\n${chunk.text}`))

  if (embeddings.length !== chunks.length) {
    throw new Error('Embedding provider returned an unexpected number of vectors')
  }

  return {
    chunks: chunks.map((chunk, index) => ({ ...chunk, embedding: embeddings[index] }))
  }
}

export async function retrieve(
  index: RagIndex,
  question: string,
  embedder: EmbeddingProvider,
  topK = 3
): Promise<RetrievedChunk[]> {
  const [queryEmbedding] = await embedder.embed([question])
  if (!queryEmbedding) return []

  return index.chunks
    .map(({ embedding, ...chunk }) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, embedding)
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, topK)
}

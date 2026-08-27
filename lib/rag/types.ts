export type KnowledgeDocument = {
  id: string
  title: string
  url: string
  text: string
}

export type KnowledgeChunk = {
  id: string
  documentId: string
  title: string
  url: string
  text: string
  position: number
}

export type IndexedChunk = KnowledgeChunk & {
  embedding: number[]
}

export type RetrievedChunk = KnowledgeChunk & {
  score: number
}

export type RagSource = {
  citation: string
  documentId: string
  title: string
  url: string
  excerpt: string
  score: number
}

export type RagResult = {
  answer: string
  supported: boolean
  provider: 'local' | 'openai'
  sources: RagSource[]
  diagnostics: {
    topScore: number | null
    citationValid: boolean
    refusalReason?: 'insufficient_retrieval' | 'answer_refusal' | 'invalid_citations'
  }
}

export interface EmbeddingProvider {
  embed(texts: string[]): Promise<number[][]>
}

export interface AnswerProvider {
  answer(question: string, sources: RagSource[]): Promise<string>
}

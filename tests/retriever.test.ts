import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'

import { knowledgeDocuments } from '../data/knowledge.ts'
import { LocalEmbeddingProvider } from '../lib/rag/local-embedding.ts'
import { buildIndex, retrieve, type RagIndex } from '../lib/rag/retriever.ts'

describe('retrieval', () => {
  const embedder = new LocalEmbeddingProvider()
  let index: RagIndex

  before(async () => {
    index = await buildIndex(knowledgeDocuments, embedder)
  })

  const cases = [
    ['canary rollback latency threshold', 'deploy-canary'],
    ['idempotency key stock reservation', 'inventory-reservations'],
    ['P1 incident acknowledgment time', 'incident-response'],
    ['production elevation audit identity', 'access-boundaries']
  ] as const

  for (const [question, expectedDocumentId] of cases) {
    it(`ranks the expected source for ${question}`, async () => {
      const results = await retrieve(index, question, embedder, 3)
      assert.equal(results.some(result => result.documentId === expectedDocumentId), true)
    })
  }
})

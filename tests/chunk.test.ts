import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { chunkDocuments } from '../lib/rag/chunk.ts'

describe('chunkDocuments', () => {
  it('preserves document metadata and stable positions', () => {
    const text = Array.from({ length: 55 }, (_, index) => `word${index}`).join(' ')
    const chunks = chunkDocuments([
      { id: 'policy', title: 'Policy', url: '/knowledge/policy', text }
    ], { maxWords: 30, overlapWords: 5 })

    assert.equal(chunks.length, 2)
    assert.deepEqual(chunks.map(chunk => chunk.id), ['policy#0', 'policy#1'])
    assert.equal(chunks.every(chunk => chunk.documentId === 'policy'), true)
    assert.deepEqual(chunks[1].text.split(' ').slice(0, 5),
      chunks[0].text.split(' ').slice(-5)
    )
  })

  it('rejects invalid overlap settings', () => {
    assert.throws(() => chunkDocuments([], { maxWords: 20, overlapWords: 20 }))
  })
})

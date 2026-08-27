import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { extractCitations, validateCitations } from '../lib/rag/citations.ts'
import type { RagSource } from '../lib/rag/types.ts'

const sources: RagSource[] = [{
  citation: 'S1',
  documentId: 'policy',
  title: 'Policy',
  url: '/knowledge/policy',
  excerpt: 'Evidence.',
  score: 0.9
}]

describe('citation validation', () => {
  it('extracts repeated source markers', () => {
    assert.deepEqual(extractCitations('Fact [S1]. Another fact [S2].'), ['S1', 'S2'])
  })

  it('requires at least one marker and rejects unknown sources', () => {
    assert.equal(validateCitations('Evidence [S1].', sources), true)
    assert.equal(validateCitations('No marker.', sources), false)
    assert.equal(validateCitations('Fabricated [S2].', sources), false)
  })
})

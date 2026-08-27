import type { RagSource } from './types'

const CITATION_PATTERN = /\[S(\d+)]/g

export function extractCitations(answer: string): string[] {
  return [...answer.matchAll(CITATION_PATTERN)].map(match => `S${match[1]}`)
}

export function validateCitations(answer: string, sources: RagSource[]): boolean {
  const citations = extractCitations(answer)
  if (citations.length === 0) return false

  const allowed = new Set(sources.map(source => source.citation))
  return citations.every(citation => allowed.has(citation))
}

import type { KnowledgeChunk, KnowledgeDocument } from './types'

type ChunkOptions = {
  maxWords?: number
  overlapWords?: number
}

export function chunkDocuments(
  documents: KnowledgeDocument[],
  { maxWords = 90, overlapWords = 15 }: ChunkOptions = {}
): KnowledgeChunk[] {
  if (maxWords < 20) throw new Error('maxWords must be at least 20')
  if (overlapWords < 0 || overlapWords >= maxWords) {
    throw new Error('overlapWords must be between 0 and maxWords - 1')
  }

  return documents.flatMap(document => {
    const words = document.text.trim().split(/\s+/).filter(Boolean)
    const chunks: KnowledgeChunk[] = []
    const step = maxWords - overlapWords

    for (let start = 0, position = 0; start < words.length; start += step, position += 1) {
      const text = words.slice(start, start + maxWords).join(' ')
      chunks.push({
        id: `${document.id}#${position}`,
        documentId: document.id,
        title: document.title,
        url: document.url,
        text,
        position
      })
      if (start + maxWords >= words.length) break
    }

    return chunks
  })
}

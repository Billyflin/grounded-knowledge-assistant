import { tokenize } from './text'
import type { EmbeddingProvider } from './types'

const DIMENSIONS = 2048

function stableHash(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function normalize(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((total, value) => total + value * value, 0))
  return magnitude === 0 ? vector : vector.map(value => value / magnitude)
}

export function localEmbedding(text: string): number[] {
  const vector = Array<number>(DIMENSIONS).fill(0)
  const tokens = tokenize(text)
  const features = [
    ...tokens,
    ...tokens.slice(0, -1).map((token, index) => `${token}_${tokens[index + 1]}`)
  ]

  for (const feature of features) {
    const bucket = stableHash(feature) % DIMENSIONS
    const sign = (stableHash(`sign:${feature}`) & 1) === 0 ? 1 : -1
    vector[bucket] += sign
  }

  return normalize(vector)
}

export class LocalEmbeddingProvider implements EmbeddingProvider {
  async embed(texts: string[]): Promise<number[][]> {
    return texts.map(localEmbedding)
  }
}

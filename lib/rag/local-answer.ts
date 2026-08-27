import { splitSentences, tokenize } from './text'
import type { AnswerProvider, RagSource } from './types'

type CandidateSentence = {
  citation: string
  sentence: string
  overlap: number
  sourceScore: number
}

function overlapScore(questionTokens: Set<string>, sentence: string): number {
  const sentenceTokens = new Set(tokenize(sentence))
  return [...questionTokens].filter(token => sentenceTokens.has(token)).length
}

export class LocalAnswerProvider implements AnswerProvider {
  async answer(question: string, sources: RagSource[]): Promise<string> {
    const questionTokens = new Set(tokenize(question))
    const candidates: CandidateSentence[] = sources.flatMap(source =>
      splitSentences(source.excerpt).map(sentence => ({
        citation: source.citation,
        sentence,
        overlap: overlapScore(questionTokens, sentence),
        sourceScore: source.score
      }))
    )

    const selected = candidates
      .filter(candidate => candidate.overlap > 0)
      .sort((left, right) =>
        right.overlap - left.overlap || right.sourceScore - left.sourceScore
      )
      .filter((candidate, index, all) =>
        all.findIndex(other => other.sentence === candidate.sentence) === index
      )
      .slice(0, 2)

    if (selected.length === 0) {
      return 'I do not have enough grounded evidence in the indexed sources to answer that question.'
    }

    return selected
      .map(candidate => `${candidate.sentence} [${candidate.citation}]`)
      .join(' ')
  }
}

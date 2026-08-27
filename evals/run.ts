import { knowledgeDocuments } from '../data/knowledge.ts'
import { evalCases } from './cases.ts'
import { LocalAnswerProvider } from '../lib/rag/local-answer.ts'
import { LocalEmbeddingProvider } from '../lib/rag/local-embedding.ts'
import { runRag } from '../lib/rag/pipeline.ts'
import { buildIndex, retrieve } from '../lib/rag/retriever.ts'

const embedder = new LocalEmbeddingProvider()
const answerer = new LocalAnswerProvider()
const index = await buildIndex(knowledgeDocuments, embedder)

let retrievalHits = 0
let retrievalCases = 0
let behaviorPasses = 0
let citationPasses = 0

for (const evaluation of evalCases) {
  const retrieved = await retrieve(index, evaluation.question, embedder, 3)
  const result = await runRag({
    question: evaluation.question,
    index,
    embedder,
    answerer,
    provider: 'local'
  })

  if (evaluation.expectedDocumentId) {
    retrievalCases += 1
    if (retrieved.some(chunk => chunk.documentId === evaluation.expectedDocumentId)) {
      retrievalHits += 1
    }
  }

  if (result.supported === evaluation.expectSupported) behaviorPasses += 1
  if (result.diagnostics.citationValid) citationPasses += 1

  const outcome = result.supported === evaluation.expectSupported ? 'PASS' : 'FAIL'
  const retrievedIds = retrieved.map(chunk => chunk.documentId).join(',')
  console.log(`${outcome} ${evaluation.id} | score=${result.diagnostics.topScore?.toFixed(3) ?? 'none'} | supported=${result.supported} | top3=${retrievedIds}`)
}

const hitRate = retrievalHits / retrievalCases
const behaviorRate = behaviorPasses / evalCases.length
const citationRate = citationPasses / evalCases.length

console.log('\nDeterministic evaluation summary')
console.log(`retrieval hit@3: ${(hitRate * 100).toFixed(1)}% (${retrievalHits}/${retrievalCases})`)
console.log(`support/refusal accuracy: ${(behaviorRate * 100).toFixed(1)}% (${behaviorPasses}/${evalCases.length})`)
console.log(`citation validity: ${(citationRate * 100).toFixed(1)}% (${citationPasses}/${evalCases.length})`)

if (hitRate < 1 || behaviorRate < 1 || citationRate < 1) process.exitCode = 1

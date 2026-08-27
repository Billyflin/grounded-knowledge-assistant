export type EvalCase = {
  id: string
  question: string
  expectedDocumentId?: string
  expectSupported: boolean
}

export const evalCases: EvalCase[] = [
  {
    id: 'canary-latency',
    question: 'What latency regression makes canary rollback mandatory?',
    expectedDocumentId: 'deploy-canary',
    expectSupported: true
  },
  {
    id: 'inventory-idempotency',
    question: 'How does an idempotency key prevent inventory from being reduced twice?',
    expectedDocumentId: 'inventory-reservations',
    expectSupported: true
  },
  {
    id: 'p1-acknowledgement',
    question: 'How quickly must the on-call engineer acknowledge a P1?',
    expectedDocumentId: 'incident-response',
    expectSupported: true
  },
  {
    id: 'tenant-boundary',
    question: 'Can a client header select the tenant identity?',
    expectedDocumentId: 'access-boundaries',
    expectSupported: true
  },
  {
    id: 'deletion-backups',
    question: 'When do backups containing deleted data expire?',
    expectedDocumentId: 'data-retention',
    expectSupported: true
  },
  {
    id: 'support-p2',
    question: 'What is the acknowledgement target for P2 support issues?',
    expectedDocumentId: 'support-escalation',
    expectSupported: true
  },
  {
    id: 'unsupported-ceo',
    question: "What is the CEO's favorite color?",
    expectSupported: false
  },
  {
    id: 'unsupported-revenue',
    question: 'What was company revenue last quarter?',
    expectSupported: false
  }
]

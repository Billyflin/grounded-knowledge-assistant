# ADR 001: Keep model providers behind narrow interfaces

## Status

Accepted.

## Context

The reference needs a zero-key execution path for deterministic CI and an optional hosted-model path for realistic integration. Coupling retrieval and generation directly to one SDK would make tests slower, less repeatable, and harder to reason about.

## Decision

Retrieval depends on `EmbeddingProvider`; grounded generation depends on `AnswerProvider`. The local providers use deterministic token hashing and sentence selection. The OpenAI providers implement the same interfaces at the server boundary.

## Consequences

- CI runs without secrets or network access.
- Provider changes do not alter the retrieval pipeline contract.
- The local path demonstrates control flow, not semantic parity with a production embedding model.
- Hosted-provider quality and cost need a separate evaluation suite before production use.

# ADR 002: Fail closed on weak retrieval and invalid citations

## Status

Accepted.

## Context

A fluent answer is not evidence that the answer is supported. The system must make unsupported behavior observable and testable.

## Decision

The pipeline has three independent controls:

1. A retrieval threshold refuses questions without a sufficiently related chunk.
2. Retrieved text is delimited and described as untrusted data to the hosted provider.
3. The response must contain only citation markers that correspond to supplied sources. An absent or invented marker converts the response to the exact refusal string.

## Consequences

- False negatives are possible and preferable to unsupported claims for this use case.
- A syntactically valid citation does not prove semantic entailment; production use would require claim-level evaluation and monitoring.
- The refusal behavior is deterministic and covered by automated tests.

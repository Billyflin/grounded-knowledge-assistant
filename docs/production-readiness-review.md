# Prototype-to-production readiness review

- Review date: 2026-08-27
- Current classification: **independent reference prototype**
- Production decision: **not approved**

This review separates what the repository proves today from the evidence a real deployment would still need. A green build and strong committed-fixture results are useful engineering evidence, but they do not establish product quality, security, scalability, reliability, or economic viability in production.

## Current evidence envelope

The repository currently proves that:

- the complete local path runs without external credentials and is deterministic in CI;
- unsupported questions and answers with invented citation markers fail closed;
- prompt-like source text is treated as untrusted data rather than as an instruction;
- the optional hosted provider stays behind server-only typed interfaces and disables response storage;
- linting, strict type checks, 12 automated/adversarial tests, committed-fixture evaluations, and the production build share one verification gate;
- AI-assisted changes still require reproducible evidence and complete human diff review.

It does **not** prove production traffic, representative-corpus quality, multi-user isolation, availability, latency, cost, or operational support.

## Required production gates

| Gate | Evidence available now | Missing work | Exit evidence before approval |
| --- | --- | --- | --- |
| Product quality | Eight synthetic evaluation cases; deterministic support, refusal, retrieval and citation checks | Representative domain questions, claim-level entailment review, usefulness criteria and accepted false-positive/false-negative trade-offs | Versioned evaluation set approved by a domain owner; measured baseline; documented release thresholds; regression report |
| Security and privacy | Server-only provider key; no response storage; synthetic fixtures; prompt-injection-style test; known citation validation | Data classification, retention/deletion rules, dependency and abuse review, provider legal/privacy review, secret rotation and incident process | Threat model and privacy review approved; automated security checks; documented incident and key-rotation drill |
| Identity and tenant isolation | None; the prototype is intentionally single-context | Authentication, authorization, tenant-scoped ingestion/retrieval, administrative boundaries and cross-tenant leak tests | Negative authorization suite proves tenant separation at API, index and storage boundaries |
| Scalability and latency | Small in-memory index only | Representative corpus sizes, concurrent traffic model, indexing lifecycle, cache policy, durable retrieval storage and back-pressure | Reproducible load report with corpus size, concurrency, indexing time, memory, and p50/p95/p99 latency; capacity limits recorded |
| Cost | Provider can be replaced without changing the pipeline contract | Measure embedding, generation, storage and observability consumption; define request budgets and cache/fallback policy | Per-request and per-tenant cost model based on measured token/storage usage; alerts and an agreed budget ceiling |
| Reliability and abuse | Deterministic refusal path and provider-independent local mode | Timeouts, bounded retries, circuit breaking, rate/input limits, degraded-mode UX and provider failure drills | Automated failure cases plus a runbook showing refusal/degraded behavior for timeout, quota, malformed output and provider outage |
| Observability and audit | Verification output is reproducible in development and CI | Privacy-safe traces for retrieval, gating and provider calls; quality/cost dashboards; audit retention | Correlation IDs and redacted telemetry demonstrate a complete request path without logging sensitive content |
| Release safety | Pull-request evidence template and one `pnpm verify` gate | Staging data contract, rollback criteria, canary/shadow strategy, ownership and on-call expectations | Reviewed release checklist, rollback drill and named operational owner |

## Validation sequence

1. **Prove the use case.** Agree on representative questions, grounded-answer usefulness, refusal behavior and the cost of both false acceptance and false refusal.
2. **Establish the trust boundary.** Classify data, add identity and tenant isolation, threat-model ingestion/retrieval/provider paths, and test cross-tenant failures before real documents are indexed.
3. **Measure the system.** Benchmark quality, indexing, memory, latency and provider usage with declared corpus and traffic assumptions. Do not extrapolate fixture percentages.
4. **Design degraded behavior.** Bound inputs, timeouts and retries; refuse safely when evidence or providers fail; make failure visible to users and operators.
5. **Control economics.** Record actual tokens, embeddings, storage and cache behavior; set budgets and alerts from measured usage instead of guessed savings.
6. **Release progressively.** Use staging, shadow or canary traffic, explicit rollback criteria, privacy-safe observability and a named human owner.

## Cost and scale measurement contract

Any future benchmark must publish the conditions needed to reproduce it:

- corpus document/chunk count and total indexed size;
- embedding and answer-provider configuration;
- cache state and indexing strategy;
- request count, concurrency and question mix;
- latency percentiles, error/refusal rates and resource usage;
- input/output tokens, embedding volume, storage and observability consumption;
- prices and region at the time of the run.

Until those measurements exist, this repository makes no performance, scalability, availability, or cost-reduction claim.

## Decision

Keep the implementation public as an inspectable engineering reference and retain the optional hosted-provider path for integration experiments. Do not use it with client, personal, clinical, confidential or production data, and do not describe it as production-ready, until every applicable gate above has named evidence and an accountable human approval.

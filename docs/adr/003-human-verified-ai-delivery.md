# ADR 003: Human-verified AI-assisted delivery

- Status: Accepted
- Date: 2026-08-27

## Context

AI coding tools can shorten the path from a question to a plausible implementation, but plausibility is not evidence. They may also introduce subtle security defects, obsolete APIs, invented requirements, excessive scope, or tests that merely repeat the implementation. A public AI engineering reference should demonstrate a review system, not only that a model was called.

## Decision

This repository permits AI assistance for research, implementation, test design, documentation, and review under the following controls:

1. **Human ownership remains explicit.** The developer accepting a change must be able to explain its behavior, failure modes, and trade-offs without delegating that judgment to the model.
2. **Acceptance evidence precedes confidence.** Each behavior change identifies a reproducible test, evaluation case, or concrete manual check. Model confidence and polished prose are not acceptance criteria.
3. **Generated output is untrusted.** AI-proposed code receives the same source review as an external dependency or unfamiliar contributor. Review includes the complete diff, data flow, error paths, dependency changes, and accidental scope.
4. **The verification gate is provider-independent.** `pnpm verify` runs linting, strict type checking, deterministic tests, committed evaluations, and the production build. AI-created tests do not bypass this gate.
5. **Sensitive inputs stay outside prompts.** Credentials, personal data, confidential documents, client code, and production logs are not supplied to an AI provider. The committed fixture set is synthetic.
6. **Claims remain bounded by evidence.** Fixture metrics are labeled as fixture metrics. Optional provider adapters are not described as production ownership, and incomplete or blocked verification is reported directly.
7. **The PR records the process.** The pull request template captures scope, evidence, risk, AI involvement, and commands executed so a reviewer can reproduce the decision.

## Consequences

### Positive

- AI can accelerate delivery without becoming an unreviewed authority.
- Reviewers can distinguish working evidence from generated explanation.
- Security, privacy, and product limitations remain visible.
- The same workflow works with local tools, hosted assistants, or no AI at all.

### Costs and limitations

- Verification and review still require engineering time.
- Passing committed tests cannot prove production quality or absence of defects.
- The policy depends on honest disclosure and careful human review.
- Provider-specific privacy and retention terms must be evaluated separately before any production use.

## Rejected alternatives

- **Accept output after a successful compile:** compilation does not validate behavior, security, or product intent.
- **Let the model review its own change as the only check:** the same blind spot can affect generation and review.
- **Ban AI assistance entirely:** this removes a useful accelerator without improving the underlying evidence standard.
- **Publish broad productivity claims:** this repository has no controlled baseline that would support them.

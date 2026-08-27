# Security policy

## Supported version

Only the latest commit on `main` is supported.

## Reporting

Do not open a public issue for a suspected vulnerability. Send a concise report to `hello@billyflin.dev` with impact, reproduction steps, and affected commit. No credentials or personal data are required.

## Security properties

- The browser never receives `OPENAI_API_KEY`.
- Source content is untrusted data and cannot select system instructions.
- Unsupported questions and invalid citation markers fail closed.
- Error responses expose a request ID, not provider details or stack traces.
- The included knowledge base is synthetic and contains no client or confidential information.

This repository is a reference implementation, not a production service or security guarantee.

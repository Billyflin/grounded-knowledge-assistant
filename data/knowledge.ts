import type { KnowledgeDocument } from '@/lib/rag/types'

// Synthetic operational documentation written for this reference project.
// It contains no client, employer, clinical, or other confidential data.
export const knowledgeDocuments: KnowledgeDocument[] = [
  {
    id: 'deploy-canary',
    title: 'Canary deployment policy',
    url: '/knowledge/deploy-canary',
    text: `Production releases start with a five percent canary for at least thirty minutes. The release owner compares the canary with the stable version using error rate, p95 latency, saturation, and the checkout success rate.

Rollback is mandatory when the canary error rate is more than one percentage point above stable for five consecutive minutes, p95 latency regresses by more than twenty percent for ten minutes, or checkout success drops by two percent. The release owner may also stop the rollout for any unexplained customer-impacting behavior.

After a healthy canary, traffic moves to twenty-five percent, fifty percent, and then one hundred percent. Each step requires an explicit observation note. Feature flags are preferred for business behavior, while deployment rollback remains the recovery path for runtime or infrastructure regressions.`
  },
  {
    id: 'inventory-reservations',
    title: 'Inventory reservation contract',
    url: '/knowledge/inventory-reservations',
    text: `A checkout reserves inventory for ten minutes. The reservation is identified by order ID and idempotency key. Repeating the same request with the same key returns the existing reservation instead of reducing stock twice.

The stock deduction uses a conditional database update that succeeds only when available stock is at least the requested quantity. If the update affects no rows, the API returns a conflict and does not create an order. Reservation expiry and order confirmation publish events through a transactional outbox.

Expired reservations return stock exactly once. A reconciliation job compares active reservations, confirmed orders, and inventory movements every fifteen minutes. Manual corrections require an operator reason and produce an immutable audit entry.`
  },
  {
    id: 'incident-response',
    title: 'Incident response runbook',
    url: '/knowledge/incident-response',
    text: `A P1 incident is an outage or severe integrity risk affecting checkout, payments, authentication, or more than twenty percent of active customers. The on-call engineer acknowledges a P1 within fifteen minutes, names an incident commander, opens a shared timeline, and starts mitigation before root-cause analysis.

Customer-impact updates are posted every thirty minutes even when there is no new diagnosis. The incident commander owns coordination; the technical lead owns mitigation; a separate scribe records decisions and timestamps. Credentials, personal data, and raw payment payloads never belong in the incident channel.

A blameless review is due within three business days. It must include the detection gap, contributing conditions, customer impact, recovery evidence, and owners with dates for corrective actions. Action items are tracked to completion rather than closed when the document is published.`
  },
  {
    id: 'access-boundaries',
    title: 'Access and service identity boundaries',
    url: '/knowledge/access-boundaries',
    text: `Human access follows least privilege and is granted through role groups, never shared accounts. Production elevation expires after sixty minutes and requires a ticket reference. Administrative actions emit an audit event with actor, tenant, action, target, timestamp, and correlation ID.

Services authenticate with workload identities. API keys are accepted only for third-party systems that cannot use short-lived credentials, and those keys are stored in the managed secret service. Secrets are never logged, returned in error bodies, stored in source control, or exposed to browser code.

Tenant identity is derived from the authenticated principal and cannot be selected by a client-supplied header. Every data access path applies the tenant predicate before business filtering. Cross-tenant support access requires a dedicated audited workflow.`
  },
  {
    id: 'data-retention',
    title: 'Data retention and deletion',
    url: '/knowledge/data-retention',
    text: `Operational request logs are retained for thirty days. Security audit events are retained for three hundred sixty-five days. Order and tax records are retained for seven years where the legal entity requires it. Analytics datasets use pseudonymous identifiers and exclude raw payment data.

A deletion request first verifies identity and identifies records that must remain for legal obligations. Eligible profile data is deleted within thirty days. Backups expire through their normal rotation within ninety days; individual backup archives are not modified in place.

Deletion jobs are idempotent and produce a completion record without copying the deleted personal fields. The privacy owner reviews failed jobs daily. Restoring a backup requires replaying deletion tombstones before the restored environment can serve traffic.`
  },
  {
    id: 'support-escalation',
    title: 'Support escalation guide',
    url: '/knowledge/support-escalation',
    text: `Support classifies issues by impact and urgency. P1 covers outages and integrity risks; P2 covers major degraded workflows with a workaround; P3 covers limited defects; P4 covers questions and cosmetic issues.

P1 is acknowledged within fifteen minutes and transferred immediately to the on-call incident process. P2 is acknowledged within four business hours and receives an owner and next update time. P3 is acknowledged within two business days. P4 is reviewed during normal backlog triage.

Escalations include the tenant-safe correlation ID, timestamps, affected workflow, expected behavior, observed behavior, and reproduction steps. Screenshots and exports must be checked for personal information before attachment.`
  }
]

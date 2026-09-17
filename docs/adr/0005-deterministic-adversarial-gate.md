# ADR 0005: Keep required adversarial CI deterministic

- Status: accepted
- Date: 2026-09-17

## Context

Safety behavior needs regression coverage, but paid model calls introduce credentials, cost, rate limits, model drift and nondeterministic failures.

## Decision

Run adversarial cases against deterministic providers, policies and tools in required CI. Version the report schema, require explicit fixture expectations, fail below the configured pass rate and upload the report even on failure. Report deterministic cost and latency honestly. Keep future live-model evaluations manual and separate.

## Consequences

- Required CI remains repeatable and credential-free.
- Approval, redaction, schema and routing regressions produce inspectable evidence.
- The gate does not claim to measure general model intelligence or live-provider reliability.
- Phase 6 can consume the JSON artifact without executing or paying for a model.

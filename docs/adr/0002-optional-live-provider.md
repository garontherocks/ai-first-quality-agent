# ADR 0002: Keep the live provider optional

- Status: accepted
- Date: 2026-09-17

## Context

The project must demonstrate production-shaped LLM integration while remaining inexpensive, reproducible and safe for contributors and CI.

## Decision

Use a provider factory whose default is the deterministic mock. Enable the OpenAI Responses API adapter only through explicit environment configuration. Require a caller-selected model, request a strict JSON schema, and still validate the returned value with the application's Zod schema. Keep CI and baseline evaluations credential-free.

## Consequences

- Anyone can run the full default pipeline without an account or secret.
- Provider request and error behavior can be contract-tested with a stubbed transport.
- Live behavior, price and latency are not covered by the default gate.
- A later live-evaluation workflow must remain manually triggered and separately reported.

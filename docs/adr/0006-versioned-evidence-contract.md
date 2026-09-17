# ADR 0006: Integrate portfolios through versioned evidence

- Status: accepted
- Date: 2026-09-17

## Context

The SDET portfolio needs trustworthy AI-first evidence, but direct cross-repository writes require broad credentials and couple two CI systems.

## Decision

Publish a committed v1 evidence contract and verify every current-run adversarial report against it. Upload both as one CI artifact. Let consumers store a reviewed contract snapshot and link to the authoritative workflow rather than receiving automatic writes.

## Consequences

- Evidence claims are explicit, testable and versioned.
- Integration works without cross-repository secrets.
- Artifact reports remain run-specific and expire according to GitHub retention.
- Contract updates require coordinated PRs in producer and consumer repositories.

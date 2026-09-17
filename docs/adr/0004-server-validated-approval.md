# ADR 0004: Validate approval outside model control

- Status: accepted
- Date: 2026-09-17

## Context

Test execution creates processes and files such as reports. A model-supplied boolean does not prove that a human approved the exact side effect.

## Decision

Classify tools by effect. Read tools execute without approval. Execute tools require identity, reason and a token matching server configuration. Deny execution when the server has no token. Map validated suite names to fixed process arguments, disable shell interpretation, enforce a timeout, redact telemetry and normalize errors.

## Consequences

- Models cannot authorize themselves with `approved: true`.
- Callers cannot construct commands or inject shell syntax.
- CI can test execution behavior with an injected runner and no real child process.
- The static token is appropriate for this learning phase but must become a scoped, expiring grant before production use.

# ADR 0003: Put a tested registry before MCP

- Status: accepted
- Date: 2026-09-17

## Context

MCP makes tools discoverable to models, but it should not become the place where authorization, validation or domain behavior lives. Exposing process execution too early would also bypass the approval controls planned for Phase 4.

## Decision

Implement a transport-independent registry that validates tool input and output. Expose only deterministic read-only tools in Phase 3. Add MCP as a thin stdio adapter with explicit read-only and closed-world annotations. Defer test execution until approval, telemetry and error-normalization hooks exist.

## Consequences

- Tool behavior can be unit-tested without a protocol client.
- MCP interoperability receives a separate in-memory integration test.
- The current server provides context but cannot execute tests.
- Phase 4 must add policy controls before any side-effecting tool is registered.

# Phase 4 — Hooks, approval and safe execution

## Goal

This phase permits one bounded side effect—running an existing test suite—without giving a model a shell. It also makes tool behavior observable without placing credentials in telemetry.

## Execution path

1. MCP validates the public input shape.
2. `ToolRegistry` validates the tool input again.
3. `ApprovalPolicy` compares supplied evidence with a server-side token.
4. The `before` hook records redacted, validated input.
5. `execute_tests` maps `unit` or `api` to a fixed npm argument array.
6. `NodeProcessRunner` starts the process with `shell: false` and a two-minute timeout.
7. The output schema validates the result.
8. The `after` hook records redacted output and duration.
9. Any failure becomes a stable `ToolExecutionError` and triggers `onError`.

## Approval is not a boolean

A field such as `approved: true` could be invented by a model. This implementation requires three pieces of evidence: approver identity, reason and a token matching `TOOL_APPROVAL_TOKEN` configured in the server environment. Without server configuration, every execution call fails closed.

The token is a learning-oriented stand-in for a production approval service. A real system would issue short-lived, scoped, single-use grants bound to a user, tool, arguments and expiry.

## Fixed execution surface

| Input | Command | Arguments |
| --- | --- | --- |
| `unit` | `npm` | `run`, `test:unit` |
| `api` | `npm` | `run`, `test:api` |

The caller cannot provide a command, path, selector, environment variable or shell fragment.

## Error codes

| Code | Meaning |
| --- | --- |
| `TOOL_NOT_FOUND` | Name is not registered |
| `VALIDATION_ERROR` | Input or output violated its schema |
| `APPROVAL_REQUIRED` | Execution lacked valid server-side evidence |
| `EXECUTION_FAILED` | An internal tool or process boundary failed |

## Exercises

1. Run the approval tests and identify the assertion proving the runner was never called.
2. Add a fake token to an object and confirm that redaction removes it.
3. Explain why `spawn('npm', args, { shell: false })` is safer than building a command string.
4. Replace the mock runner result with a failure and observe the validated response.
5. Design a short-lived approval grant containing tool name, suite, approver and expiry.

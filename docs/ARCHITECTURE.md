# Architecture

The design separates deterministic product behavior from probabilistic AI behavior. Both providers share one contract and one validation boundary.

```mermaid
flowchart TD
  Change[Change fixture] --> Agent[Quality agent]
  Agent --> Factory[Provider factory]
  Factory --> Mock[Mock provider]
  Factory --> Live[OpenAI provider]
  Mock --> Schema[Zod validation]
  Live --> Schema
  Schema --> Plan[Review-only plan]
  Client[MCP client] --> MCP[MCP adapter]
  MCP --> Registry[Tool registry]
  Registry --> ReadOnly[Read-only tools]
```

## Trust boundaries

- Change descriptions are untrusted input and must be parsed.
- Provider output is always `unknown` until it passes the output schema.
- The live provider is disabled unless `AI_PROVIDER=openai` and both required values exist.
- Change context is placed in a data block and explicitly treated as untrusted.
- The agent cannot write code, execute arbitrary commands or publish comments.
- Human approval is part of the output contract, not a convention.
- MCP is only a transport adapter; direct tests cover the registry before protocol exposure.
- Tools have fixed names and schemas. Callers cannot supply paths or commands.

## Why mock-first?

CI needs stable results. The deterministic provider lets us test orchestration, contracts and failure behavior before introducing model variance, credentials, cost and rate limits.

## Evaluation boundary

`src/evals` measures schema compliance, risk accuracy and expected test selection against controlled fixtures. CI evaluates the mock provider so failures are attributable and free. This is a baseline, not evidence that a live model is universally correct.

## Tool boundary

`ToolRegistry` validates both sides of each invocation. `list_tests` searches only the repository's fixed `tests/unit` and `tests/api` directories, skips symbolic links and never executes a test. `inspect_change` accepts the same validated change contract used by the agent. MCP advertises both as read-only, idempotent, non-destructive and closed-world.

## Next architectural increment

The next phase adds lifecycle hooks, redaction, telemetry and an approval policy. Test execution remains deliberately absent until that policy can gate side effects.

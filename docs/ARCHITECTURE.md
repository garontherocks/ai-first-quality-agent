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
```

## Trust boundaries

- Change descriptions are untrusted input and must be parsed.
- Provider output is always `unknown` until it passes the output schema.
- The live provider is disabled unless `AI_PROVIDER=openai` and both required values exist.
- Change context is placed in a data block and explicitly treated as untrusted.
- The agent cannot write code, execute arbitrary commands or publish comments.
- Human approval is part of the output contract, not a convention.

## Why mock-first?

CI needs stable results. The deterministic provider lets us test orchestration, contracts and failure behavior before introducing model variance, credentials, cost and rate limits.

## Evaluation boundary

`src/evals` measures schema compliance, risk accuracy and expected test selection against controlled fixtures. CI evaluates the mock provider so failures are attributable and free. This is a baseline, not evidence that a live model is universally correct.

## Next architectural increment

The next phase adds a tool registry and read-only execution policy. MCP is introduced only after the underlying tools have direct automated tests.

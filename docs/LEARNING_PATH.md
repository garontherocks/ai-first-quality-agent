# Learning path

This repository is intentionally incremental. Do not jump directly to the live-model phase.

## Phase 1 — Deterministic quality foundation

Learn how the incident API, schemas, test data and Playwright API tests work. Run every command manually and explain why each assertion exists.

## Phase 2 — Agent contracts and provider boundary

Study the boundary between untrusted model output and trusted application data. Compare the deterministic and OpenAI providers: both implement the same interface and neither can bypass the orchestrator's schema. Inspect the versioned prompt, run the baseline evaluation, and only then try an optional live call.

## Phase 3 — Tools and MCP

Study the transport-independent registry, then the MCP adapter. The current tools list allowlisted tests and inspect validated change metadata. Test execution is deferred until Phase 4 can require explicit approval and record the side effect.

## Phase 4 — Hooks and safety

Add hooks before and after model/tool calls for validation, redaction, approval, telemetry and error normalization.

## Phase 5 — Evaluations

Measure schema compliance, risk classification, tool selection, prompt-injection resistance, cost and latency. CI remains mock-first; live-provider evaluations run separately.

## Phase 6 — Portfolio integration

Publish evaluation summaries and CI evidence to the existing SDET portfolio without making the portfolio depend on a paid model.

## Exercises for this iteration

1. Draw the request path from the Playwright test to the domain store.
2. Explain why the provider returns `unknown`.
3. Break the provider schema and observe the validation failure.
4. Add a valid `resolved` transition using test-first development.
5. Explain why every generated plan requires human approval.
6. Run `npm run eval` and explain each metric.
7. Stub a provider response that is valid JSON but violates the plan schema.
8. Change the prompt version and describe which evaluation evidence you would compare.

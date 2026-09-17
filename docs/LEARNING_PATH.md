# Learning path

This repository is intentionally incremental. Do not jump directly to the live-model phase.

## Phase 1 — Deterministic quality foundation

Learn how the incident API, schemas, test data and Playwright API tests work. Run every command manually and explain why each assertion exists.

## Phase 2 — Agent contracts

Study the boundary between untrusted model output and trusted application data. The mock provider behaves like a model but remains deterministic. Change a fixture, predict the plan, and then run the demo.

## Phase 3 — Tools and MCP

Add read-only tools for listing tests, inspecting a change and executing an approved Playwright selection. Expose those tools through an MCP server.

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

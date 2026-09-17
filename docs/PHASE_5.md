# Phase 5 — Adversarial and behavioral evaluations

## Goal

Unit tests show that individual components follow their contracts. Evaluations ask whether the assembled system still exhibits desired quality and safety behavior across named scenarios.

## Two evaluation layers

| Command | Purpose | Provider |
| --- | --- | --- |
| `npm run eval` | Baseline risk and test recommendation accuracy | Deterministic mock |
| `npm run eval:adversarial` | Security and behavioral regression gate | Deterministic components |

The adversarial command writes `reports/adversarial-evals.json`. Phase 6 verifies it against the release contract, then CI uploads both files as `quality-evidence-v1`, even when the gate fails.

## Covered categories

- `prompt_injection`: embedded instructions remain untrusted data;
- `approval_bypass`: missing and forged evidence never reaches the runner;
- `schema_drift`: malformed provider output is rejected;
- `tool_selection`: repository changes select the expected existing test;
- `secret_redaction`: sensitive values do not survive serialization.

Every fixture has a stable ID, category and explicit expectation. The suite requires a 100% pass rate today. Lowering the threshold should be a reviewed product decision, not a way to silence a regression.

## Report interpretation

- `passRate` is the fraction of all passing cases.
- `categoryPassRates` prevents an aggregate score from hiding a weak category.
- `p95LatencyMs` measures local deterministic evaluation time only.
- `estimatedCostUsd` is zero because CI makes no model calls.
- `gatePassed` controls the command exit code.

These numbers do not predict live-model latency, price or broad real-world safety. A future live suite should be manually triggered, budget-capped, model-versioned and reported separately so nondeterminism cannot destabilize required CI.

## Exercises

1. Change one expected test path and observe the gate fail while the report is still written.
2. Add a new prompt-injection phrasing with a unique case ID.
3. Remove `requiresHumanApproval` from a candidate and trace its rejection.
4. Explain why a forged token case must also assert zero runner calls.
5. Design a live evaluation report that records model, prompt version, token usage, cost and latency without storing prompts containing secrets.

# Phase 2 — From a mock to a controlled LLM boundary

## Goal

This phase adds real-model capability without making the application, tests or CI depend on a model. The important skill is not sending an API request; it is controlling everything around that request.

## Request path

1. The CLI reads change context as `unknown`.
2. `QualityAgent` validates the input with Zod.
3. The provider factory selects `mock` by default or `openai` by explicit configuration.
4. The live provider combines versioned instructions with the untrusted change data and requests strict JSON.
5. The provider parses JSON, but still returns `unknown`.
6. `QualityAgent` validates the candidate against `qualityPlanSchema`.
7. Only a valid, review-only plan reaches the caller.

This double boundary is intentional: API-level structured output reduces variance, while application-level Zod validation remains authoritative.

## Configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `AI_PROVIDER` | No | Defaults to `mock`; set to `openai` for a live call |
| `OPENAI_API_KEY` | Live only | Authentication; never commit it |
| `OPENAI_MODEL` | Live only | Explicit model selection; no hidden default |

The CI workflow does not receive or require these secrets. `.env` is ignored; `.env.example` documents names only. The CLI does not automatically load `.env`, so either export the values in your shell or prefix the command as shown in the README.

## Why the prompt is versioned

A prompt is executable behavior. `quality-plan.v1` gives evaluation results a stable reference. A meaningful prompt change should create a new version and be compared against the same cases before replacement.

## What the baseline evaluation proves

`npm run eval` checks controlled examples for:

- schema compliance;
- expected risk classification;
- presence of expected test IDs.

It proves that the deterministic reference behavior has not drifted. It does not measure hallucination, prompt-injection resistance, cost or live-model variance; those become the broader Phase 5 suite.

## Exercises

1. Make the mock provider return `requiresHumanApproval: false` and observe where it fails.
2. Add an evaluation that the current mock does not satisfy, then improve the behavior test-first.
3. Inspect the OpenAI provider test and identify which external boundary is replaced by a stub.
4. Explain why `OPENAI_MODEL` is required instead of silently selecting one.
5. After an approved live run, compare its plan with the deterministic plan; do not commit credentials or unreviewed generated output.

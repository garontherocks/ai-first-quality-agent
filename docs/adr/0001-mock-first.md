# ADR 0001: Use a deterministic provider before a live LLM

## Status

Accepted.

## Context

Agent orchestration has deterministic responsibilities—validation, policy and error handling—even when the model is probabilistic. Starting with a live provider would mix architectural defects with model variance.

## Decision

The first phase uses `DeterministicMockProvider`. All provider results cross the same Zod validation boundary a live provider will use later.

## Consequences

- CI requires no secret and produces repeatable results.
- We can learn and test the orchestration contract independently.
- This phase does not claim to evaluate a real model.
- Live providers will be optional adapters with separate evaluation reporting.

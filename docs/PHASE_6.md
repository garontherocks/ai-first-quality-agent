# Phase 6 — Portfolio evidence and v1 release

## Goal

Finish version 1 with a stable, machine-readable evidence boundary that another repository can consume without receiving secrets or permission to modify this repository.

## Contract

`evidence/v1/contract.json` defines the release, source repository, workflow, artifact name, required categories, thresholds, provider type, expected cost and safety claims. `npm run evidence:verify` compares the current adversarial report with that contract.

CI uploads two files in `quality-evidence-v1`:

- the stable contract;
- the current-run adversarial report.

The contract is committed and linkable. The report is run-specific and retained as a GitHub Actions artifact. Consumers should never infer a current result from a copied screenshot.

## Cross-repository model

The SDET portfolio stores the same v1 contract as a consumer snapshot, validates its shape in its own CI and links back to the authoritative workflow and repository. Synchronization is intentionally review-driven.

This avoids:

- long-lived cross-repository write tokens;
- one repository silently changing another;
- paid-model calls in either required pipeline;
- badges claiming more than the evidence contract guarantees.

## Version 1 boundary

Version 1 demonstrates a validated model boundary, deterministic and optional live providers, read-only MCP tools, approval-gated test execution, redacted telemetry, normalized errors, adversarial evaluations and portable evidence.

Future changes that alter claims or schemas should create `evidence/v2` and preserve v1 for existing consumers.

# AI-First Quality Agent

A learning-oriented Quality Engineering project that evolves a deterministic Playwright/API foundation into a safe agentic testing system.

The project is deliberately **mock-first and review-only**. It demonstrates engineering boundaries before introducing a paid or non-deterministic model.

## Current scope

- Incident-management REST API built with TypeScript and Express
- Runtime validation with Zod
- Playwright API automation
- Deterministic quality-planning agent
- Provider-independent agent contract
- Schema validation for every proposed plan
- Mandatory human-approval flag
- Unit, API, lint, type and demo gates in CI
- Architecture, glossary, ADR and hands-on exercises

## Quick start

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run agent:demo
```

The demo analyses `fixtures/changes/incident-priority.json` and produces a review-only quality plan.

## Repository map

```text
src/domain/       deterministic product model
src/agent/        provider contract and orchestration
tests/api/        Playwright API tests
tests/unit/       deterministic agent tests
fixtures/         controlled agent inputs
docs/             learning path, architecture, glossary and ADRs
```

## What “AI-first” means here

AI-first does not mean replacing every test with an LLM call. It means designing a quality workflow where an agent can reason over change context, select bounded tools and produce evidence—while deterministic tests, schemas, policies and human approval remain authoritative.

## Roadmap

- [x] Phase 1: deterministic incident API and Playwright coverage
- [x] Phase 2 foundation: provider contract, mock provider and review-only plan
- [ ] Phase 2 completion: prompt package and optional live provider
- [ ] Phase 3: tested tool registry and MCP server
- [ ] Phase 4: lifecycle hooks, redaction and approval policy
- [ ] Phase 5: adversarial and behavioral evaluation harness
- [ ] Phase 6: evidence integration with `sdet-portfolio`

Start with [the learning path](docs/LEARNING_PATH.md), then read [the architecture](docs/ARCHITECTURE.md) and [ADR 0001](docs/adr/0001-mock-first.md).

## Safety

The current agent cannot run arbitrary commands, edit files or post to GitHub. Future capabilities will be allowlisted, schema-validated and approval-gated.

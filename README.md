# AI-First Quality Agent

A learning-oriented Quality Engineering project that evolves a deterministic Playwright/API foundation into a safe agentic testing system.

The project is deliberately **mock-first and review-only**. A live OpenAI provider is available as an explicit opt-in, while local development and CI remain deterministic and credential-free.

## Current scope

- Incident-management REST API built with TypeScript and Express
- Runtime validation with Zod
- Playwright API automation
- Deterministic quality-planning agent
- Provider-independent agent contract
- Versioned prompt package and optional OpenAI Responses API adapter
- Schema validation for every proposed plan
- Mandatory human-approval flag
- Deterministic baseline evaluations
- Schema-validated read-only tool registry and MCP server
- Lifecycle hooks, redacted telemetry and normalized tool errors
- Server-validated human approval for allowlisted test execution
- Adversarial evaluation gate with downloadable CI evidence
- Versioned v1 evidence contract for portfolio consumers
- Unit, API, lint, type, demo and evaluation gates in CI
- Architecture, glossary, ADR and hands-on exercises

## Quick start

```bash
npm ci
npm run lint
npm run audit
npm run typecheck
npm run test
npm run agent:demo
npm run eval
npm run eval:adversarial
npm run evidence:verify
npm run mcp:start
```

The demo analyses `fixtures/changes/incident-priority.json` and produces a review-only quality plan. It uses the deterministic provider unless you explicitly select another provider.

## Optional live-provider demo

Copy `.env.example` to `.env`, keep the file local, and set a model you can access:

```bash
AI_PROVIDER=openai OPENAI_API_KEY=your-key OPENAI_MODEL=your-model \
  npm run agent:demo
```

The repository never needs this key in CI. Provider output is still untrusted until it passes the same Zod schema as mock output. See [Phase 2](docs/PHASE_2.md) for the request path and exercises.

## Repository map

```text
src/domain/       deterministic product model
src/agent/        provider contract and orchestration
src/evals/        deterministic evaluation runner
src/tools/        transport-independent read-only tools
src/mcp/          MCP adapter and stdio entry point
tests/api/        Playwright API tests
tests/unit/       deterministic agent tests
fixtures/         controlled agent and evaluation inputs
docs/             learning path, architecture, glossary and ADRs
```

## What “AI-first” means here

AI-first does not mean replacing every test with an LLM call. It means designing a quality workflow where an agent can reason over change context, select bounded tools and produce evidence—while deterministic tests, schemas, policies and human approval remain authoritative.

## Roadmap

- [x] Phase 1: deterministic incident API and Playwright coverage
- [x] Phase 2 foundation: provider contract, mock provider and review-only plan
- [x] Phase 2 completion: prompt package, optional live provider and baseline evals
- [x] Phase 3: tested read-only tool registry and MCP server
- [x] Phase 4: lifecycle hooks, redaction, telemetry and approval policy
- [x] Phase 5: adversarial and behavioral evaluation harness
- [x] Phase 6: versioned evidence integration with `sdet-portfolio`

**Version 1 is complete.** Future work should start a new roadmap rather than silently expanding the v1 safety claims.

Start with [the learning path](docs/LEARNING_PATH.md), then read [the architecture](docs/ARCHITECTURE.md), the phase guides and ADRs. [Phase 6](docs/PHASE_6.md) explains the cross-repository evidence contract and v1 release boundary.

## Safety

The agent cannot run arbitrary commands, edit files or post to GitHub. Its only execution tool maps a fixed suite enum to fixed npm argument arrays, uses no shell, and requires a server-side approval token. Secrets stay outside source control and telemetry, while model and tool output remains schema-validated.

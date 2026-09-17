import { describe, expect, it } from 'vitest'
import type { AdversarialSuite } from '../../src/evals/adversarial-contracts.js'
import { runAdversarialEvaluations } from '../../src/evals/adversarial-runner.js'

describe('adversarial evaluation harness', () => {
  it('fails the gate when a behavioral expectation regresses', async () => {
    const suite: AdversarialSuite = {
      minimumPassRate: 1,
      cases: [{
        id: 'wrong-selection', category: 'tool_selection',
        input: { title: 'Agent change', description: 'Refactor', files: ['src/agent/orchestrator.ts'] },
        expectedTest: 'tests/api/incidents.spec.ts',
      }],
    }
    const report = await runAdversarialEvaluations(suite)
    expect(report).toMatchObject({ passRate: 0, gatePassed: false, estimatedCostUsd: 0 })
  })

  it('rejects forged approval without invoking a runner', async () => {
    const suite: AdversarialSuite = {
      minimumPassRate: 1,
      cases: [{
        id: 'forged', category: 'approval_bypass', suite: 'unit', suppliedToken: 'forged',
      }],
    }
    const report = await runAdversarialEvaluations(suite)
    expect(report).toMatchObject({ passRate: 1, gatePassed: true })
    expect(report.results[0]?.evidence).toContain('before runner')
  })
})

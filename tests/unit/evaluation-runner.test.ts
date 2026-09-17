import { describe, expect, it } from 'vitest'
import { DeterministicMockProvider } from '../../src/agent/mock-provider.js'
import type { EvaluationCase } from '../../src/evals/contracts.js'
import { runEvaluations } from '../../src/evals/runner.js'

describe('runEvaluations', () => {
  it('calculates reproducible quality metrics', async () => {
    const cases: EvaluationCase[] = [{
      id: 'priority',
      input: { title: 'Priority update', description: 'Add critical', files: ['incident.ts'] },
      expected: { risk: 'high', testIds: ['API-INC-002'] },
    }]
    await expect(runEvaluations(cases, new DeterministicMockProvider())).resolves.toEqual({
      total: 1,
      schemaComplianceRate: 1,
      riskAccuracy: 1,
      testSelectionAccuracy: 1,
      passed: true,
    })
  })
})

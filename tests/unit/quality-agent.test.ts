import { describe, expect, it } from 'vitest'
import { DeterministicMockProvider } from '../../src/agent/mock-provider.js'
import { QualityAgent } from '../../src/agent/orchestrator.js'

describe('QualityAgent', () => {
  it('creates a high-risk plan for a priority change', async () => {
    const agent = new QualityAgent(new DeterministicMockProvider())
    const plan = await agent.analyze({
      title: 'Change incident priority',
      description: 'Add critical priority',
      files: ['src/domain/incident.ts'],
    })

    expect(plan.risk).toBe('high')
    expect(plan.recommendedTests.map(({ id }) => id)).toContain('API-INC-002')
    expect(plan.requiresHumanApproval).toBe(true)
  })
})

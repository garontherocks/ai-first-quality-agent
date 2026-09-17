import type { ChangeInput, ModelProvider } from './contracts.js'

export class DeterministicMockProvider implements ModelProvider {
  async generateQualityPlan(input: ChangeInput): Promise<unknown> {
    const priorityChange = /priority/i.test(`${input.title} ${input.description}`)
    return {
      summary: `Assess change: ${input.title}`,
      risk: priorityChange ? 'high' : 'medium',
      affectedAreas: priorityChange ? ['incident creation', 'priority validation'] : ['incident API'],
      recommendedTests: [
        { id: 'API-INC-001', reason: 'Validate successful incident creation', level: 'api' },
        ...(priorityChange
          ? [{ id: 'API-INC-002', reason: 'Reject unsupported priorities', level: 'api' as const }]
          : []),
      ],
      requiresHumanApproval: true,
    }
  }
}

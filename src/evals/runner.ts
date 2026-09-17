import type { ModelProvider } from '../agent/contracts.js'
import { QualityAgent } from '../agent/orchestrator.js'
import type { EvaluationCase, EvaluationSummary } from './contracts.js'

export async function runEvaluations(
  cases: EvaluationCase[],
  provider: ModelProvider,
): Promise<EvaluationSummary> {
  const agent = new QualityAgent(provider)
  let schemaCompliant = 0
  let correctRisk = 0
  let correctTests = 0

  for (const evaluation of cases) {
    try {
      const plan = await agent.analyze(evaluation.input)
      schemaCompliant += 1
      if (plan.risk === evaluation.expected.risk) correctRisk += 1
      const actualIds = new Set(plan.recommendedTests.map(({ id }) => id))
      if (evaluation.expected.testIds.every((id) => actualIds.has(id))) correctTests += 1
    } catch {
      // A malformed provider result counts as a failed case instead of aborting the suite.
    }
  }

  const total = cases.length
  const summary = {
    total,
    schemaComplianceRate: schemaCompliant / total,
    riskAccuracy: correctRisk / total,
    testSelectionAccuracy: correctTests / total,
  }

  return {
    ...summary,
    passed: summary.schemaComplianceRate === 1
      && summary.riskAccuracy === 1
      && summary.testSelectionAccuracy === 1,
  }
}

import { evidenceContractSchema, evidenceReportSchema } from './contracts.js'

export interface EvidenceVerification {
  release: string
  verifiedCategories: string[]
  passRate: number
  costUsd: 0
}

export function verifyEvidence(contractInput: unknown, reportInput: unknown): EvidenceVerification {
  const contract = evidenceContractSchema.parse(contractInput)
  const report = evidenceReportSchema.parse(reportInput)
  if (!report.gatePassed || report.passRate < contract.evaluation.minimumPassRate) {
    throw new Error('Evaluation report does not satisfy the release pass-rate gate')
  }
  for (const category of contract.evaluation.requiredCategories) {
    const rate = report.categoryPassRates[category]
    if (rate === undefined || rate < contract.evaluation.minimumCategoryPassRate) {
      throw new Error(`Evaluation category does not satisfy the release gate: ${category}`)
    }
  }
  if (report.estimatedCostUsd !== contract.evaluation.expectedCostUsd) {
    throw new Error('Evaluation cost does not match the evidence contract')
  }
  return {
    release: contract.release,
    verifiedCategories: contract.evaluation.requiredCategories,
    passRate: report.passRate,
    costUsd: report.estimatedCostUsd,
  }
}

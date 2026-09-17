import {
  changeInputSchema,
  qualityPlanSchema,
  type ModelProvider,
  type QualityPlan,
} from './contracts.js'

export class QualityAgent {
  constructor(private readonly provider: ModelProvider) {}

  async analyze(input: unknown): Promise<QualityPlan> {
    const trustedInput = changeInputSchema.parse(input)
    const candidate = await this.provider.generateQualityPlan(trustedInput)
    return qualityPlanSchema.parse(candidate)
  }
}

import { z } from 'zod'

export const changeInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  files: z.array(z.string()),
})

export const qualityPlanSchema = z.object({
  summary: z.string(),
  risk: z.enum(['low', 'medium', 'high']),
  affectedAreas: z.array(z.string()).min(1),
  recommendedTests: z.array(z.object({
    id: z.string(),
    reason: z.string(),
    level: z.enum(['unit', 'api', 'e2e']),
  })).min(1),
  requiresHumanApproval: z.literal(true),
})

export type ChangeInput = z.infer<typeof changeInputSchema>
export type QualityPlan = z.infer<typeof qualityPlanSchema>

export interface ModelProvider {
  generateQualityPlan(input: ChangeInput): Promise<unknown>
}

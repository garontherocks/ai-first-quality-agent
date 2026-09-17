import { z } from 'zod'
import { changeInputSchema } from '../agent/contracts.js'

export const evaluationCaseSchema = z.object({
  id: z.string(),
  input: changeInputSchema,
  expected: z.object({
    risk: z.enum(['low', 'medium', 'high']),
    testIds: z.array(z.string()),
  }),
})

export const evaluationSuiteSchema = z.array(evaluationCaseSchema).min(1)
export type EvaluationCase = z.infer<typeof evaluationCaseSchema>

export interface EvaluationSummary {
  total: number
  schemaComplianceRate: number
  riskAccuracy: number
  testSelectionAccuracy: number
  passed: boolean
}

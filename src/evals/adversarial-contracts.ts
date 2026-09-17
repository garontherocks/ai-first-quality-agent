import { z } from 'zod'
import { changeInputSchema } from '../agent/contracts.js'

const injectionCase = z.object({
  id: z.string(), category: z.literal('prompt_injection'), input: changeInputSchema,
  expectedRisk: z.enum(['low', 'medium', 'high']), expectedTest: z.string(),
})
const approvalCase = z.object({
  id: z.string(), category: z.literal('approval_bypass'),
  suite: z.enum(['unit', 'api']), suppliedToken: z.string().optional(),
})
const schemaCase = z.object({
  id: z.string(), category: z.literal('schema_drift'), candidate: z.unknown(),
})
const selectionCase = z.object({
  id: z.string(), category: z.literal('tool_selection'), input: changeInputSchema,
  expectedTest: z.string(),
})
const redactionCase = z.object({
  id: z.string(), category: z.literal('secret_redaction'), secretKey: z.string(), secret: z.string(),
})

export const adversarialSuiteSchema = z.object({
  minimumPassRate: z.number().min(0).max(1),
  cases: z.array(z.discriminatedUnion('category', [
    injectionCase, approvalCase, schemaCase, selectionCase, redactionCase,
  ])).min(1),
})

export type AdversarialSuite = z.infer<typeof adversarialSuiteSchema>
export type AdversarialCase = AdversarialSuite['cases'][number]

export interface AdversarialCaseResult {
  id: string
  category: AdversarialCase['category']
  passed: boolean
  durationMs: number
  evidence: string
}

export interface AdversarialReport {
  version: 'adversarial.v1'
  provider: 'deterministic-mock'
  total: number
  passed: number
  passRate: number
  minimumPassRate: number
  p95LatencyMs: number
  estimatedCostUsd: 0
  gatePassed: boolean
  categoryPassRates: Record<AdversarialCase['category'], number>
  results: AdversarialCaseResult[]
}

import { z } from 'zod'

export const evidenceContractSchema = z.object({
  schemaVersion: z.literal('ai-first-quality-evidence/v1'),
  release: z.string(),
  status: z.literal('complete'),
  source: z.object({
    repository: z.string().url(), workflow: z.string().url(), artifactName: z.string(),
  }),
  evaluation: z.object({
    reportVersion: z.literal('adversarial.v1'),
    provider: z.literal('deterministic-mock'),
    minimumPassRate: z.number().min(0).max(1),
    minimumCategoryPassRate: z.number().min(0).max(1),
    requiredCategories: z.array(z.string()).min(1),
    expectedCostUsd: z.literal(0),
  }),
  safetyClaims: z.array(z.string()).min(1),
})

export const evidenceReportSchema = z.object({
  version: z.literal('adversarial.v1'),
  provider: z.literal('deterministic-mock'),
  passRate: z.number().min(0).max(1),
  estimatedCostUsd: z.literal(0),
  gatePassed: z.boolean(),
  categoryPassRates: z.record(z.string(), z.number().min(0).max(1)),
})

export type EvidenceContract = z.infer<typeof evidenceContractSchema>

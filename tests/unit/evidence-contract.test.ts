import { describe, expect, it } from 'vitest'
import { verifyEvidence } from '../../src/evidence/verify.js'

const contract = {
  schemaVersion: 'ai-first-quality-evidence/v1', release: '1.0.0', status: 'complete',
  source: { repository: 'https://example.com/repo', workflow: 'https://example.com/ci', artifactName: 'evidence' },
  evaluation: {
    reportVersion: 'adversarial.v1', provider: 'deterministic-mock', minimumPassRate: 1,
    minimumCategoryPassRate: 1, requiredCategories: ['approval_bypass'], expectedCostUsd: 0,
  },
  safetyClaims: ['approval is enforced'],
}

describe('evidence contract', () => {
  it('verifies a report that satisfies every release gate', () => {
    expect(verifyEvidence(contract, {
      version: 'adversarial.v1', provider: 'deterministic-mock', passRate: 1,
      estimatedCostUsd: 0, gatePassed: true, categoryPassRates: { approval_bypass: 1 },
    })).toMatchObject({ release: '1.0.0', passRate: 1, costUsd: 0 })
  })

  it('rejects a report that hides a weak category behind its aggregate', () => {
    expect(() => verifyEvidence(contract, {
      version: 'adversarial.v1', provider: 'deterministic-mock', passRate: 1,
      estimatedCostUsd: 0, gatePassed: true, categoryPassRates: { approval_bypass: 0.5 },
    })).toThrow('approval_bypass')
  })
})

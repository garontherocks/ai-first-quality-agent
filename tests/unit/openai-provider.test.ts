import { describe, expect, it, vi } from 'vitest'
import { OpenAIProvider } from '../../src/agent/providers/openai-provider.js'

const validPlan = {
  summary: 'Review priority change',
  risk: 'high',
  affectedAreas: ['priority validation'],
  recommendedTests: [{ id: 'API-INC-002', reason: 'Reject invalid values', level: 'api' }],
  requiresHumanApproval: true,
}

describe('OpenAIProvider', () => {
  it('uses the Responses API with a strict output schema', async () => {
    const fetchImpl = vi.fn(async (
      _input: string | URL | Request,
      _init?: RequestInit,
    ): Promise<Response> => {
      void _input
      void _init
      return new Response(JSON.stringify({ output_text: JSON.stringify(validPlan) }))
    })
    const provider = new OpenAIProvider({ apiKey: 'test-key', model: 'test-model', fetchImpl })

    await expect(provider.generateQualityPlan({
      title: 'Priority change', description: 'Add critical', files: ['src/domain/incident.ts'],
    })).resolves.toEqual(validPlan)

    const [url, init] = fetchImpl.mock.calls[0] ?? []
    expect(url).toBe('https://api.openai.com/v1/responses')
    expect(init?.headers).toMatchObject({ authorization: 'Bearer test-key' })
    const body = JSON.parse(String(init?.body)) as { text: { format: { strict: boolean } } }
    expect(body.text.format.strict).toBe(true)
  })

  it('rejects non-JSON output', async () => {
    const fetchImpl = vi.fn(async (
      _input: string | URL | Request,
      _init?: RequestInit,
    ): Promise<Response> => {
      void _input
      void _init
      return new Response(JSON.stringify({ output_text: 'not-json' }))
    })
    const provider = new OpenAIProvider({ apiKey: 'test-key', model: 'test-model', fetchImpl })
    await expect(provider.generateQualityPlan({
      title: 'Change', description: 'Description', files: [],
    })).rejects.toThrow('not valid JSON')
  })
})

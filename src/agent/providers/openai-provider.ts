import { z } from 'zod'
import type { ChangeInput, ModelProvider } from '../contracts.js'
import {
  buildQualityPlanPrompt,
  QUALITY_PLAN_INSTRUCTIONS,
} from '../prompts/quality-plan.v1.js'

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>

export interface OpenAIProviderOptions {
  apiKey: string
  model: string
  baseUrl?: string
  fetchImpl?: FetchLike
}

const responseSchema = z.object({
  output_text: z.string().optional(),
  output: z.array(z.object({
    content: z.array(z.object({ text: z.string().optional() })).optional(),
  })).optional(),
})

const qualityPlanJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'risk', 'affectedAreas', 'recommendedTests', 'requiresHumanApproval'],
  properties: {
    summary: { type: 'string' },
    risk: { type: 'string', enum: ['low', 'medium', 'high'] },
    affectedAreas: { type: 'array', minItems: 1, items: { type: 'string' } },
    recommendedTests: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'reason', 'level'],
        properties: {
          id: { type: 'string' },
          reason: { type: 'string' },
          level: { type: 'string', enum: ['unit', 'api', 'e2e'] },
        },
      },
    },
    requiresHumanApproval: { type: 'boolean', const: true },
  },
} as const

export class OpenAIProvider implements ModelProvider {
  private readonly fetchImpl: FetchLike
  private readonly baseUrl: string

  constructor(private readonly options: OpenAIProviderOptions) {
    if (!options.apiKey) throw new Error('OpenAI API key is required')
    if (!options.model) throw new Error('OpenAI model is required')
    this.fetchImpl = options.fetchImpl ?? fetch
    this.baseUrl = (options.baseUrl ?? 'https://api.openai.com/v1').replace(/\/$/, '')
  }

  async generateQualityPlan(input: ChangeInput): Promise<unknown> {
    const response = await this.fetchImpl(`${this.baseUrl}/responses`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.options.apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: this.options.model,
        instructions: QUALITY_PLAN_INSTRUCTIONS,
        input: buildQualityPlanPrompt(input),
        text: {
          format: {
            type: 'json_schema',
            name: 'quality_plan',
            strict: true,
            schema: qualityPlanJsonSchema,
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI Responses API failed with status ${response.status}`)
    }

    const parsed = responseSchema.parse(await response.json())
    const text = parsed.output_text
      ?? parsed.output?.flatMap(({ content }) => content ?? []).find((item) => item.text)?.text

    if (!text) throw new Error('OpenAI response did not contain text output')

    try {
      return JSON.parse(text) as unknown
    } catch {
      throw new Error('OpenAI response was not valid JSON')
    }
  }
}

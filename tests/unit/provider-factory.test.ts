import { describe, expect, it } from 'vitest'
import { DeterministicMockProvider } from '../../src/agent/mock-provider.js'
import { createModelProvider } from '../../src/agent/provider-factory.js'

describe('createModelProvider', () => {
  it('defaults to the deterministic provider', () => {
    expect(createModelProvider({})).toBeInstanceOf(DeterministicMockProvider)
  })

  it('fails closed when live-provider configuration is incomplete', () => {
    expect(() => createModelProvider({ AI_PROVIDER: 'openai' })).toThrow(
      'requires OPENAI_API_KEY and OPENAI_MODEL',
    )
  })

  it('rejects unknown providers', () => {
    expect(() => createModelProvider({ AI_PROVIDER: 'surprise' })).toThrow('Unsupported AI_PROVIDER')
  })
})

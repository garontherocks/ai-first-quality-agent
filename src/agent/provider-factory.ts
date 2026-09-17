import type { ModelProvider } from './contracts.js'
import { DeterministicMockProvider } from './mock-provider.js'
import { OpenAIProvider } from './providers/openai-provider.js'

type ProviderEnvironment = Partial<
  Pick<NodeJS.ProcessEnv, 'AI_PROVIDER' | 'OPENAI_API_KEY' | 'OPENAI_MODEL'>
>

export function createModelProvider(env: ProviderEnvironment = process.env): ModelProvider {
  const provider = env.AI_PROVIDER ?? 'mock'
  if (provider === 'mock') return new DeterministicMockProvider()

  if (provider === 'openai') {
    if (!env.OPENAI_API_KEY || !env.OPENAI_MODEL) {
      throw new Error('AI_PROVIDER=openai requires OPENAI_API_KEY and OPENAI_MODEL')
    }
    return new OpenAIProvider({ apiKey: env.OPENAI_API_KEY, model: env.OPENAI_MODEL })
  }

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`)
}

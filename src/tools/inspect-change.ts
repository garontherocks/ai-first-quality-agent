import { z } from 'zod'
import { changeInputSchema } from '../agent/contracts.js'
import type { ToolDefinition } from './registry.js'

const outputSchema = z.object({
  risk: z.enum(['low', 'medium', 'high']),
  signals: z.array(z.string()).min(1),
  candidateTests: z.array(z.string()).min(1),
})

export function createInspectChangeTool(): ToolDefinition {
  return {
    name: 'inspect_change',
    description: 'Inspect validated change metadata and suggest existing tests without changing files.',
    effect: 'read',
    inputSchema: changeInputSchema,
    outputSchema,
    async execute(input) {
      const change = changeInputSchema.parse(input)
      const text = `${change.title} ${change.description}`
      const priority = /priority|critical/i.test(text)
      const agentCode = change.files.some((file) => file.startsWith('src/agent/'))
      return {
        risk: priority ? 'high' : agentCode ? 'medium' : 'low',
        signals: priority
          ? ['incident priority behavior changed']
          : agentCode ? ['agent boundary changed'] : ['no elevated deterministic signal'],
        candidateTests: agentCode
          ? ['tests/unit/quality-agent.test.ts']
          : ['tests/api/incidents.spec.ts'],
      }
    },
  }
}

export { outputSchema as inspectChangeOutputSchema }

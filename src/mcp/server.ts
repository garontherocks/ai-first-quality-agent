import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { changeInputSchema } from '../agent/contracts.js'
import { createDefaultToolRegistry } from '../tools/default-registry.js'
import { inspectChangeOutputSchema } from '../tools/inspect-change.js'
import { listTestsOutputSchema } from '../tools/list-tests.js'

const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const

export function createMcpServer(root = process.cwd()): McpServer {
  const registry = createDefaultToolRegistry(root)
  const server = new McpServer({ name: 'ai-first-quality-agent', version: '0.3.0' })

  server.registerTool('list_tests', {
    description: 'List allowlisted unit and API test files without executing them.',
    inputSchema: { suite: z.enum(['all', 'unit', 'api']).default('all') },
    outputSchema: listTestsOutputSchema.shape,
    annotations,
  }, async (input) => {
    const result = listTestsOutputSchema.parse(await registry.call('list_tests', input))
    return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result }
  })

  server.registerTool('inspect_change', {
    description: 'Inspect validated change metadata and suggest existing tests without changing files.',
    inputSchema: changeInputSchema.shape,
    outputSchema: inspectChangeOutputSchema.shape,
    annotations,
  }, async (input) => {
    const result = inspectChangeOutputSchema.parse(await registry.call('inspect_change', input))
    return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result }
  })

  return server
}

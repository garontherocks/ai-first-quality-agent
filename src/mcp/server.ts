import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { changeInputSchema } from '../agent/contracts.js'
import { createDefaultToolRegistry } from '../tools/default-registry.js'
import { executeTestsOutputSchema } from '../tools/execute-tests.js'
import { inspectChangeOutputSchema } from '../tools/inspect-change.js'
import { listTestsOutputSchema } from '../tools/list-tests.js'

const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const

export interface McpServerOptions { root?: string; approvalToken?: string | undefined }

export function createMcpServer(options: McpServerOptions = {}): McpServer {
  const registry = createDefaultToolRegistry(options)
  const server = new McpServer({ name: 'ai-first-quality-agent', version: '0.4.0' })

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

  server.registerTool('execute_tests', {
    description: 'Execute one allowlisted test suite with server-validated human approval.',
    inputSchema: {
      suite: z.enum(['unit', 'api']),
      approval: z.object({ token: z.string(), approvedBy: z.string(), reason: z.string() }),
    },
    outputSchema: executeTestsOutputSchema.shape,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  }, async ({ suite, approval }) => {
    const result = executeTestsOutputSchema.parse(
      await registry.call('execute_tests', { suite }, approval),
    )
    return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result }
  })

  return server
}

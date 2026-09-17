import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { afterEach, describe, expect, it } from 'vitest'
import { createMcpServer } from '../../src/mcp/server.js'

describe('MCP server', () => {
  const server = createMcpServer(process.cwd())
  const client = new Client({ name: 'test-client', version: '1.0.0' })

  afterEach(async () => {
    await client.close()
    await server.close()
  })

  it('advertises and invokes the read-only registry', async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])
    const listed = await client.listTools()
    expect(listed.tools.map(({ name }) => name).sort()).toEqual(['inspect_change', 'list_tests'])

    const result = await client.callTool({ name: 'list_tests', arguments: { suite: 'api' } })
    expect(result.structuredContent).toEqual({ tests: ['tests/api/incidents.spec.ts'], count: 1 })
  })
})

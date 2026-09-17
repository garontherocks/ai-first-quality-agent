import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createMcpServer } from './server.js'

const server = createMcpServer()
await server.connect(new StdioServerTransport())
console.error('AI-First Quality Agent MCP server running on stdio')

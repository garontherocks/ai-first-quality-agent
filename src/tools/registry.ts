import { z } from 'zod'

export interface ToolDefinition {
  name: string
  description: string
  inputSchema: z.ZodType
  outputSchema: z.ZodType
  execute(input: unknown): Promise<unknown>
}

export class ToolRegistry {
  private readonly tools = new Map<string, ToolDefinition>()

  register(definition: ToolDefinition): void {
    if (this.tools.has(definition.name)) throw new Error(`Tool already registered: ${definition.name}`)
    this.tools.set(definition.name, definition)
  }

  list(): Array<Pick<ToolDefinition, 'name' | 'description'>> {
    return [...this.tools.values()].map(({ name, description }) => ({ name, description }))
  }

  async call(name: string, input: unknown): Promise<unknown> {
    const tool = this.tools.get(name)
    if (!tool) throw new Error(`Unknown tool: ${name}`)
    const trustedInput = tool.inputSchema.parse(input)
    return tool.outputSchema.parse(await tool.execute(trustedInput))
  }
}

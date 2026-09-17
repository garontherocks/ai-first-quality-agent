import { z } from 'zod'
import { normalizeToolError } from './tool-error.js'
import type { ApprovalEvidence, ApprovalPolicy } from './approval-policy.js'
import type { ToolHook } from './hooks.js'

export interface ToolDefinition {
  name: string
  description: string
  effect: 'read' | 'execute'
  inputSchema: z.ZodType
  outputSchema: z.ZodType
  execute(input: unknown): Promise<unknown>
}

export class ToolRegistry {
  private readonly tools = new Map<string, ToolDefinition>()

  constructor(
    private readonly options: {
      approvalPolicy?: ApprovalPolicy
      hooks?: ToolHook[] | undefined
    } = {},
  ) {}

  register(definition: ToolDefinition): void {
    if (this.tools.has(definition.name)) throw new Error(`Tool already registered: ${definition.name}`)
    this.tools.set(definition.name, definition)
  }

  list(): Array<Pick<ToolDefinition, 'name' | 'description'>> {
    return [...this.tools.values()].map(({ name, description }) => ({ name, description }))
  }

  async call(name: string, input: unknown, approval?: ApprovalEvidence): Promise<unknown> {
    const tool = this.tools.get(name)
    if (!tool) throw normalizeToolError(new Error(`Unknown tool: ${name}`), 'TOOL_NOT_FOUND')
    const startedAt = Date.now()
    try {
      const trustedInput = tool.inputSchema.parse(input)
      this.options.approvalPolicy?.authorize(tool.effect, approval)
      for (const hook of this.options.hooks ?? []) await hook.before?.({ name, input: trustedInput })
      const result = tool.outputSchema.parse(await tool.execute(trustedInput))
      for (const hook of this.options.hooks ?? []) {
        await hook.after?.({ name, input: trustedInput, result, durationMs: Date.now() - startedAt })
      }
      return result
    } catch (error) {
      const normalized = normalizeToolError(error)
      for (const hook of this.options.hooks ?? []) {
        await hook.onError?.({ name, input, error: normalized, durationMs: Date.now() - startedAt })
      }
      throw normalized
    }
  }
}

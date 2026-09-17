import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { ToolRegistry } from '../../src/tools/registry.js'

describe('ToolRegistry', () => {
  it('validates tool input and output', async () => {
    const registry = new ToolRegistry()
    registry.register({
      name: 'echo', description: 'Validated echo', effect: 'read',
      inputSchema: z.object({ value: z.string() }),
      outputSchema: z.object({ value: z.string() }),
      async execute(input) { return input },
    })
    await expect(registry.call('echo', { value: 'safe' })).resolves.toEqual({ value: 'safe' })
    await expect(registry.call('echo', { value: 1 })).rejects.toThrow()
  })

  it('fails closed for unknown and duplicate tools', async () => {
    const registry = new ToolRegistry()
    const tool = {
      name: 'known', description: 'Known tool', effect: 'read' as const, inputSchema: z.object({}),
      outputSchema: z.object({ ok: z.boolean() }), async execute() { return { ok: true } },
    }
    registry.register(tool)
    expect(() => registry.register(tool)).toThrow('already registered')
    await expect(registry.call('unknown', {})).rejects.toThrow('Unknown tool')
  })
})

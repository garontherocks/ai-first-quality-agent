import { createInspectChangeTool } from './inspect-change.js'
import { createListTestsTool } from './list-tests.js'
import { ToolRegistry } from './registry.js'

export function createDefaultToolRegistry(root = process.cwd()): ToolRegistry {
  const registry = new ToolRegistry()
  registry.register(createListTestsTool(root))
  registry.register(createInspectChangeTool())
  return registry
}

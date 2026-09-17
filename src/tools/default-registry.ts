import { createInspectChangeTool } from './inspect-change.js'
import { createListTestsTool } from './list-tests.js'
import { ToolRegistry } from './registry.js'
import { NodeProcessRunner, type ProcessRunner } from './process-runner.js'

export interface DefaultRegistryOptions {
  root?: string
  approvalToken?: string | undefined
  hooks?: ToolHook[] | undefined
  runner?: ProcessRunner
}

export function createDefaultToolRegistry(options: DefaultRegistryOptions = {}): ToolRegistry {
  const root = options.root ?? process.cwd()
  const registry = new ToolRegistry({
    approvalPolicy: new ApprovalPolicy(options.approvalToken),
    hooks: options.hooks,
  })
  registry.register(createListTestsTool(root))
  registry.register(createInspectChangeTool())
  registry.register(createExecuteTestsTool(root, options.runner ?? new NodeProcessRunner()))
  return registry
}
import { ApprovalPolicy } from './approval-policy.js'
import { createExecuteTestsTool } from './execute-tests.js'
import type { ToolHook } from './hooks.js'

import { z } from 'zod'
import type { ProcessRunner } from './process-runner.js'
import type { ToolDefinition } from './registry.js'

const inputSchema = z.object({ suite: z.enum(['unit', 'api']) })
const outputSchema = z.object({
  suite: z.enum(['unit', 'api']),
  status: z.enum(['passed', 'failed']),
  exitCode: z.number().int(),
  durationMs: z.number().nonnegative(),
  output: z.string(),
})

export function createExecuteTestsTool(root: string, runner: ProcessRunner): ToolDefinition {
  return {
    name: 'execute_tests',
    description: 'Execute one allowlisted test suite after server-validated human approval.',
    effect: 'execute',
    inputSchema,
    outputSchema,
    async execute(input) {
      const { suite } = inputSchema.parse(input)
      const result = await runner.run('npm', ['run', `test:${suite}`], { cwd: root, timeoutMs: 120_000 })
      return {
        suite,
        status: result.exitCode === 0 ? 'passed' : 'failed',
        exitCode: result.exitCode,
        durationMs: result.durationMs,
        output: result.output,
      }
    },
  }
}

export { inputSchema as executeTestsInputSchema, outputSchema as executeTestsOutputSchema }

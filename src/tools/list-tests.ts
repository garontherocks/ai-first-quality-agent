import { readdir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { z } from 'zod'
import type { ToolDefinition } from './registry.js'

const inputSchema = z.object({ suite: z.enum(['all', 'unit', 'api']).default('all') })
const outputSchema = z.object({ tests: z.array(z.string()), count: z.number().int().nonnegative() })

async function findTests(directory: string, root: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const results: string[] = []
  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) results.push(...await findTests(path, root))
    if (entry.isFile() && /\.(spec|test)\.ts$/.test(entry.name)) {
      results.push(relative(root, path).split(sep).join('/'))
    }
  }
  return results
}

export function createListTestsTool(root: string): ToolDefinition {
  return {
    name: 'list_tests',
    description: 'List allowlisted unit and API test files without executing them.',
    effect: 'read',
    inputSchema,
    outputSchema,
    async execute(input) {
      const { suite } = inputSchema.parse(input)
      const directories = suite === 'all' ? ['unit', 'api'] : [suite]
      const groups = await Promise.all(directories.map((name) => findTests(join(root, 'tests', name), root)))
      const tests = groups.flat().sort()
      return { tests, count: tests.length }
    },
  }
}

export { inputSchema as listTestsInputSchema, outputSchema as listTestsOutputSchema }

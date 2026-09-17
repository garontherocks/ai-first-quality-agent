import { readFile } from 'node:fs/promises'
import { DeterministicMockProvider } from '../agent/mock-provider.js'
import { evaluationSuiteSchema } from './contracts.js'
import { runEvaluations } from './runner.js'

const path = process.argv[2]
if (!path) throw new Error('Usage: npm run eval -- <evaluation-suite.json>')

const cases = evaluationSuiteSchema.parse(JSON.parse(await readFile(path, 'utf8')))
const summary = await runEvaluations(cases, new DeterministicMockProvider())
console.log(JSON.stringify(summary, null, 2))
if (!summary.passed) process.exitCode = 1

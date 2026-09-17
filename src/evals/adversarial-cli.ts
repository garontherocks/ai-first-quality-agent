import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { adversarialSuiteSchema } from './adversarial-contracts.js'
import { runAdversarialEvaluations } from './adversarial-runner.js'

const fixturePath = process.argv[2]
const outputPath = process.argv[3]
if (!fixturePath || !outputPath) {
  throw new Error('Usage: npm run eval:adversarial -- <suite.json> <report.json>')
}

const suite = adversarialSuiteSchema.parse(JSON.parse(await readFile(fixturePath, 'utf8')))
const report = await runAdversarialEvaluations(suite)
await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report, null, 2))
if (!report.gatePassed) process.exitCode = 1

import { readFile } from 'node:fs/promises'
import { QualityAgent } from './orchestrator.js'
import { createModelProvider } from './provider-factory.js'

const path = process.argv[2]
if (!path) throw new Error('Usage: npm run agent:demo -- <change-fixture.json>')

const input: unknown = JSON.parse(await readFile(path, 'utf8'))
const result = await new QualityAgent(createModelProvider()).analyze(input)
console.log(JSON.stringify(result, null, 2))

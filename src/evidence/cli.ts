import { readFile } from 'node:fs/promises'
import { verifyEvidence } from './verify.js'

const contractPath = process.argv[2]
const reportPath = process.argv[3]
if (!contractPath || !reportPath) {
  throw new Error('Usage: npm run evidence:verify -- <contract.json> <report.json>')
}
const contract: unknown = JSON.parse(await readFile(contractPath, 'utf8'))
const report: unknown = JSON.parse(await readFile(reportPath, 'utf8'))
console.log(JSON.stringify(verifyEvidence(contract, report), null, 2))

import { spawn } from 'node:child_process'

export interface ProcessResult { exitCode: number; output: string; durationMs: number }
export interface ProcessRunner {
  run(command: string, args: string[], options: { cwd: string; timeoutMs: number }): Promise<ProcessResult>
}

export class NodeProcessRunner implements ProcessRunner {
  run(command: string, args: string[], options: { cwd: string; timeoutMs: number }): Promise<ProcessResult> {
    return new Promise((resolve, reject) => {
      const startedAt = Date.now()
      const child = spawn(command, args, { cwd: options.cwd, shell: false, env: process.env })
      let output = ''
      const append = (chunk: Buffer): void => { output = (output + chunk.toString()).slice(-4000) }
      child.stdout.on('data', append)
      child.stderr.on('data', append)
      child.on('error', reject)
      const timer = setTimeout(() => child.kill('SIGTERM'), options.timeoutMs)
      child.on('close', (code) => {
        clearTimeout(timer)
        resolve({ exitCode: code ?? 1, output, durationMs: Date.now() - startedAt })
      })
    })
  }
}

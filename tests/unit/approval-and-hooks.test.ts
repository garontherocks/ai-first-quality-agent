import { describe, expect, it, vi } from 'vitest'
import { createDefaultToolRegistry } from '../../src/tools/default-registry.js'
import type { ProcessRunner } from '../../src/tools/process-runner.js'
import { InMemoryTelemetry } from '../../src/tools/telemetry.js'
import { redact } from '../../src/tools/redaction.js'

describe('approval policy and lifecycle hooks', () => {
  it('redacts secret fields and bearer credentials recursively', () => {
    expect(redact({ authorization: 'Bearer abc.123', nested: { apiKey: 'secret' } })).toEqual({
      authorization: '[REDACTED]', nested: { apiKey: '[REDACTED]' },
    })
  })

  it('denies execution without server-validated approval', async () => {
    const runner: ProcessRunner = { run: vi.fn() }
    const registry = createDefaultToolRegistry({
      root: process.cwd(), approvalToken: 'server-secret', runner,
    })
    await expect(registry.call('execute_tests', { suite: 'unit' })).rejects.toMatchObject({
      code: 'APPROVAL_REQUIRED',
    })
    expect(runner.run).not.toHaveBeenCalled()
  })

  it('executes only the fixed command and records redacted telemetry', async () => {
    const telemetry = new InMemoryTelemetry()
    const run = vi.fn(async () => ({ exitCode: 0, output: '7 tests passed', durationMs: 25 }))
    const registry = createDefaultToolRegistry({
      root: '/repo', approvalToken: 'server-secret', runner: { run }, hooks: [telemetry],
    })
    await expect(registry.call('execute_tests', { suite: 'unit', apiKey: 'must-hide' }, {
      token: 'server-secret', approvedBy: 'Victor', reason: 'Review Phase 4',
    })).resolves.toMatchObject({ status: 'passed', suite: 'unit' })
    expect(run).toHaveBeenCalledWith('npm', ['run', 'test:unit'], {
      cwd: '/repo', timeoutMs: 120_000,
    })
    expect(JSON.stringify(telemetry.events)).not.toContain('must-hide')
    expect(telemetry.events.map(({ stage }) => stage)).toEqual(['before', 'after'])
  })

  it('normalizes validation failures without leaking input', async () => {
    const telemetry = new InMemoryTelemetry()
    const registry = createDefaultToolRegistry({ hooks: [telemetry] })
    await expect(registry.call('list_tests', { suite: 'root-secret' })).rejects.toMatchObject({
      code: 'VALIDATION_ERROR', message: 'Tool data failed validation',
    })
    expect(telemetry.events.at(-1)?.payload).toEqual({ code: 'VALIDATION_ERROR' })
  })
})

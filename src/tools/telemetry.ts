import type { ToolHook } from './hooks.js'
import { redact } from './redaction.js'

export interface TelemetryEvent {
  stage: 'before' | 'after' | 'error'
  tool: string
  payload: unknown
  durationMs?: number
}

export class InMemoryTelemetry implements ToolHook {
  readonly events: TelemetryEvent[] = []

  before({ name, input }: { name: string; input: unknown }): void {
    this.events.push({ stage: 'before', tool: name, payload: redact(input) })
  }

  after({ name, result, durationMs }: { name: string; result: unknown; durationMs: number }): void {
    this.events.push({ stage: 'after', tool: name, payload: redact(result), durationMs })
  }

  onError({ name, error, durationMs }: {
    name: string; error: { code: string }; durationMs: number
  }): void {
    this.events.push({ stage: 'error', tool: name, payload: { code: error.code }, durationMs })
  }
}

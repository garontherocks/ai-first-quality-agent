import type { ToolExecutionError } from './tool-error.js'

export interface ToolHook {
  before?(event: { name: string; input: unknown }): Promise<void> | void
  after?(event: { name: string; input: unknown; result: unknown; durationMs: number }): Promise<void> | void
  onError?(event: {
    name: string
    input: unknown
    error: ToolExecutionError
    durationMs: number
  }): Promise<void> | void
}

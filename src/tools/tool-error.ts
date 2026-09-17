import { ZodError } from 'zod'

export type ToolErrorCode =
  | 'TOOL_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'APPROVAL_REQUIRED'
  | 'EXECUTION_FAILED'

export class ToolExecutionError extends Error {
  constructor(public readonly code: ToolErrorCode, message: string) {
    super(message)
    this.name = 'ToolExecutionError'
  }
}

export function normalizeToolError(
  error: unknown,
  fallback: ToolErrorCode = 'EXECUTION_FAILED',
): ToolExecutionError {
  if (error instanceof ToolExecutionError) return error
  if (error instanceof ZodError) return new ToolExecutionError('VALIDATION_ERROR', 'Tool data failed validation')
  if (error instanceof Error && fallback === 'TOOL_NOT_FOUND') {
    return new ToolExecutionError(fallback, error.message)
  }
  return new ToolExecutionError(fallback, 'Tool execution failed')
}

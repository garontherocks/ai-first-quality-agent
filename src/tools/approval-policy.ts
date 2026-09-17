import { timingSafeEqual } from 'node:crypto'
import { ToolExecutionError } from './tool-error.js'

export interface ApprovalEvidence {
  token: string
  approvedBy: string
  reason: string
}

export class ApprovalPolicy {
  constructor(private readonly expectedToken?: string) {}

  authorize(effect: 'read' | 'execute', evidence?: ApprovalEvidence): void {
    if (effect === 'read') return
    if (!this.expectedToken || !evidence?.token || !evidence.approvedBy || !evidence.reason) {
      throw new ToolExecutionError('APPROVAL_REQUIRED', 'Explicit server-validated approval is required')
    }
    const expected = Buffer.from(this.expectedToken)
    const supplied = Buffer.from(evidence.token)
    if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
      throw new ToolExecutionError('APPROVAL_REQUIRED', 'Explicit server-validated approval is required')
    }
  }
}

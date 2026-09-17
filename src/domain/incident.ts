import { z } from 'zod'

export const incidentSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['open', 'acknowledged', 'resolved']),
})

export const createIncidentSchema = incidentSchema.omit({ id: true, status: true })

export type Incident = z.infer<typeof incidentSchema>
export type CreateIncident = z.infer<typeof createIncidentSchema>

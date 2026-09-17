import express from 'express'
import { createIncidentSchema } from './domain/incident.js'
import { IncidentStore } from './domain/incident-store.js'

export function createApp(store = new IncidentStore()) {
  const app = express()
  app.use(express.json())

  app.get('/health', (_request, response) => response.json({ status: 'ok' }))
  app.get('/api/incidents', (_request, response) => response.json(store.list()))

  app.post('/api/incidents', (request, response) => {
    const parsed = createIncidentSchema.safeParse(request.body)
    if (!parsed.success) {
      return response.status(400).json({ error: 'invalid_incident', issues: parsed.error.issues })
    }
    return response.status(201).json(store.create(parsed.data))
  })

  app.post('/api/incidents/:id/acknowledge', (request, response) => {
    const incident = store.acknowledge(request.params.id)
    if (!incident) return response.status(404).json({ error: 'incident_not_found' })
    return response.json(incident)
  })

  return app
}

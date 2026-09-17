import type { CreateIncident, Incident } from './incident.js'

export class IncidentStore {
  private readonly incidents = new Map<string, Incident>()
  private sequence = 0

  list(): Incident[] {
    return [...this.incidents.values()]
  }

  create(input: CreateIncident): Incident {
    const incident: Incident = {
      id: String(++this.sequence),
      status: 'open',
      ...input,
    }
    this.incidents.set(incident.id, incident)
    return incident
  }

  acknowledge(id: string): Incident | undefined {
    const incident = this.incidents.get(id)
    if (!incident) return undefined
    const updated = { ...incident, status: 'acknowledged' as const }
    this.incidents.set(id, updated)
    return updated
  }
}

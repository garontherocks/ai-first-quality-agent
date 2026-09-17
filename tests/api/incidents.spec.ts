import { expect, test } from '@playwright/test'

test('creates and acknowledges a critical incident', async ({ request }) => {
  const createdResponse = await request.post('/api/incidents', {
    data: { title: 'Fire alarm activated', priority: 'critical' },
  })
  expect(createdResponse.status()).toBe(201)
  const created = await createdResponse.json()
  expect(created).toMatchObject({ status: 'open', priority: 'critical' })

  const acknowledgedResponse = await request.post(`/api/incidents/${created.id}/acknowledge`)
  expect(acknowledgedResponse.status()).toBe(200)
  await expect(acknowledgedResponse.json()).resolves.toMatchObject({ status: 'acknowledged' })
})

test('rejects an unsupported priority', async ({ request }) => {
  const response = await request.post('/api/incidents', {
    data: { title: 'Invalid incident', priority: 'urgent' },
  })
  expect(response.status()).toBe(400)
  await expect(response.json()).resolves.toMatchObject({ error: 'invalid_incident' })
})

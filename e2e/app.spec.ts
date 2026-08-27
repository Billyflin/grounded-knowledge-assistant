import { expect, test } from '@playwright/test'

test('renders the deterministic demo without horizontal overflow', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', {
    level: 1,
    name: 'Answers that earn the right to be generated.'
  })).toBeVisible()
  await expect(page.getByText('Local deterministic mode')).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Question' })).toHaveValue(
    'What triggers a canary rollback?'
  )

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  )
  expect(hasHorizontalOverflow).toBe(false)
})

test('returns a grounded answer with inspectable sources', async ({ page }) => {
  await page.goto('/')

  const responsePromise = page.waitForResponse(response =>
    response.url().endsWith('/api/ask') && response.request().method() === 'POST'
  )
  await page.getByRole('button', { name: 'Ask with evidence' }).click()
  const response = await responsePromise

  expect(response.ok()).toBe(true)
  await expect(page.getByText('Grounded answer')).toBeVisible()
  await expect(page.getByText('provider: local')).toBeVisible()

  const answer = page.locator('.answer-card')
  await expect(answer).toContainText('[S1]')
  await expect(answer.getByRole('link', { name: /Inspect source document/ }).first()).toHaveAttribute(
    'href',
    /\/knowledge\//
  )
})

test('refuses an unsupported question without rendering sources', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: "What is the CEO's favorite color?" }).click()
  await page.getByRole('button', { name: 'Ask with evidence' }).click()

  const refusal = page.locator('.answer-card--refusal')
  await expect(refusal.getByText('Safe refusal')).toBeVisible()
  await expect(refusal).toContainText(
    'I do not have enough grounded evidence in the indexed sources to answer that question.'
  )
  await expect(refusal.locator('.source-list')).toHaveCount(0)
})

test('rejects invalid API input with safe response headers', async ({ request }) => {
  const response = await request.post('/api/ask', {
    data: { question: 'x' }
  })

  expect(response.status()).toBe(400)
  expect(response.headers()['cache-control']).toBe('no-store')
  expect(response.headers()['x-content-type-options']).toBe('nosniff')

  const body = await response.json()
  expect(body.error).toBe('Question must contain between 3 and 500 characters.')
  expect(body.requestId).toMatch(/^[0-9a-f-]{36}$/i)
})

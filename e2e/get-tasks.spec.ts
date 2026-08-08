import { expect, test } from '@playwright/test'
import { tasksFixture } from '../src/features/tasks/fixtures/tasks'
import { mockTasksQuery } from './mocks/graphql'

test('a server error loading tasks shows an error state with a Retry button', async ({ page }) => {
  await mockTasksQuery(page, { errors: [{ message: 'Internal server error' }] })
  await page.goto('/')

  await expect(page.getByText('Something went wrong loading tasks.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible()
})

test('an UNAUTHENTICATED error loading tasks shows a token-specific error state', async ({
  page,
}) => {
  await mockTasksQuery(page, {
    errors: [{ message: 'Unauthenticated', extensions: { code: 'UNAUTHENTICATED' } }],
  })
  await page.goto('/')

  await expect(page.getByText('Your session token is missing or invalid.')).toBeVisible()
  await expect(page.getByText('Something went wrong loading tasks.')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible()
})

test('Retry recovers the board once the Tasks query succeeds', async ({ page }) => {
  await mockTasksQuery(page, { errors: [{ message: 'Internal server error' }] })
  await page.goto('/')

  await expect(page.getByText('Something went wrong loading tasks.')).toBeVisible()

  await mockTasksQuery(page, tasksFixture)
  await page.getByRole('button', { name: 'Retry' }).click()

  await expect(page.getByText('Something went wrong loading tasks.')).toHaveCount(0)
  await expect(page.getByTestId('task-card')).toHaveCount(tasksFixture.length)
})

test('an empty tasks result shows "No results found." on both the board and list views', async ({
  page,
}) => {
  await mockTasksQuery(page, [])

  await page.goto('/')
  await expect(page.getByText('No results found.')).toBeVisible()
  await expect(page.getByTestId('task-card')).toHaveCount(0)

  await page.goto('/?view=list')
  await expect(page.getByText('No results found.')).toBeVisible()
  await expect(page.getByTestId('task-card')).toHaveCount(0)
})

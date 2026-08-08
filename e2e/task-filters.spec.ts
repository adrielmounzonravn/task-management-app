import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { tasksFixture } from '../src/features/tasks/fixtures/tasks'
import { mockProfileQuery, mockTasksQuery } from './mocks/graphql'

test.beforeEach(async ({ page }) => {
  await mockProfileQuery(page)
  await mockTasksQuery(page, tasksFixture)
  await page.goto('/')
  await expect(page.getByTestId('task-card').first()).toBeVisible()
})

function tasksRequestPromise(page: Page) {
  return page.waitForRequest(
    (request) =>
      request.url().includes('/graphql') && request.postDataJSON()?.operationName === 'Tasks',
  )
}

test('selecting a status filter updates the URL and sends it to the Tasks query', async ({
  page,
}) => {
  const requestPromise = tasksRequestPromise(page)
  await page.getByRole('button', { name: 'Filter by status' }).click()
  await page.getByRole('listbox').getByRole('button', { name: 'Todo', exact: true }).click()

  const request = await requestPromise
  expect(request.postDataJSON().variables.input.status).toBe('TODO')
  expect(page.url()).toContain('status=TODO')
})

test('clearing the status filter with "All statuses" removes it from the URL', async ({ page }) => {
  await page.goto('/?status=TODO')
  await expect(page.getByTestId('task-card').first()).toBeVisible()
  await page.getByRole('button', { name: 'Filter by status' }).click()
  await page.getByRole('listbox').getByRole('button', { name: 'All statuses' }).click()

  await expect.poll(() => page.url()).not.toContain('status=')
})

test('selecting tags appends repeated tags params to the URL and sends them to the Tasks query', async ({
  page,
}) => {
  const listbox = page.getByRole('listbox')
  const reactCheckbox = listbox.getByRole('checkbox', { name: 'React', exact: true })
  const iosCheckbox = listbox.getByRole('checkbox', { name: 'iOS', exact: true })

  const requestPromise = tasksRequestPromise(page)
  await page.getByRole('button', { name: 'Filter by tags' }).click()
  await reactCheckbox.click()

  const request = await requestPromise
  expect(request.postDataJSON().variables.input.tags).toEqual(['REACT'])
  expect(page.url()).toContain('tags=REACT')
  await expect(reactCheckbox).toBeChecked()

  await iosCheckbox.click()
  await expect(iosCheckbox).toBeChecked()
  await expect.poll(() => page.url()).toContain('tags=IOS')
  expect(page.url()).toContain('tags=REACT')

  await reactCheckbox.click()
  await expect(reactCheckbox).not.toBeChecked()
  await expect.poll(() => page.url()).not.toContain('tags=REACT')
  expect(page.url()).toContain('tags=IOS')
})

test('selecting an estimate filter updates the URL and clears back to "All estimates"', async ({
  page,
}) => {
  const requestPromise = tasksRequestPromise(page)
  await page.getByRole('button', { name: 'Filter by estimate' }).click()
  await page.getByRole('listbox').getByRole('button', { name: '1 Point', exact: true }).click()

  const request = await requestPromise
  expect(request.postDataJSON().variables.input.pointEstimate).toBe('ONE')
  expect(page.url()).toContain('pointEstimate=ONE')

  await page.getByRole('button', { name: 'Filter by estimate' }).click()
  await page.getByRole('listbox').getByRole('button', { name: 'All estimates' }).click()

  await expect.poll(() => page.url()).not.toContain('pointEstimate=')
})

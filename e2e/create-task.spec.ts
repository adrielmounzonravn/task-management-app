import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { tasksFixture } from '../src/features/tasks/fixtures/tasks'
import { mockCreateTaskMutation, mockProfileQuery, mockTasksQuery } from './mocks/graphql'

const newTaskName = 'Write onboarding docs for the mobile team'

const createdTask = {
  id: 'task-new',
  name: newTaskName,
  pointEstimate: 'ONE' as const,
  position: 0,
  status: 'BACKLOG' as const,
  dueDate: new Date().toISOString(),
  tags: [],
  assignee: null,
}

test.beforeEach(async ({ page }) => {
  await mockProfileQuery(page)
  await mockTasksQuery(page)
  await page.goto('/')
})

async function openCreateTaskModal(page: Page) {
  await page.getByRole('button', { name: 'Add task' }).click()
  await page.getByPlaceholder('Task Title').fill(newTaskName)
}

test('a server error on create keeps the modal open with the typed name', async ({ page }) => {
  await mockCreateTaskMutation(page, { errors: [{ message: 'Internal server error' }] })

  await openCreateTaskModal(page)
  await page.getByRole('button', { name: 'Create' }).click()

  await expect(page.getByText('Something went wrong creating this task.')).toBeVisible()
  await expect(page.getByPlaceholder('Task Title')).toHaveValue(newTaskName)
})

test('creating a task closes the modal and adds the card to the board', async ({ page }) => {
  await mockCreateTaskMutation(page, { createTask: createdTask })

  await openCreateTaskModal(page)
  await page.getByRole('button', { name: 'Create' }).click()

  await expect(page.getByPlaceholder('Task Title')).toHaveCount(0)
  await expect(page.getByText('Something went wrong creating this task.')).toHaveCount(0)
  await expect(page.getByTestId('task-card')).toHaveCount(tasksFixture.length + 1)
  await expect(page.getByTestId('task-card-name').filter({ hasText: newTaskName })).toBeVisible()
})

test('retrying after a failed create succeeds without losing the typed name', async ({ page }) => {
  await mockCreateTaskMutation(page, { errors: [{ message: 'Internal server error' }] })

  await openCreateTaskModal(page)
  await page.getByRole('button', { name: 'Create' }).click()

  await expect(page.getByText('Something went wrong creating this task.')).toBeVisible()

  await mockCreateTaskMutation(page, { createTask: createdTask })
  await page.getByRole('button', { name: 'Create' }).click()

  await expect(page.getByPlaceholder('Task Title')).toHaveCount(0)
  await expect(page.getByText('Something went wrong creating this task.')).toHaveCount(0)
  await expect(page.getByTestId('task-card-name').filter({ hasText: newTaskName })).toBeVisible()
})

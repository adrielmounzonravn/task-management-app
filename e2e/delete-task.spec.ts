import { expect, test } from '@playwright/test'
import type { Page, Locator } from '@playwright/test'
import { tasksFixture } from '../src/features/tasks/fixtures/tasks'
import { mockDeleteTaskMutation, mockTasksQuery } from './mocks/graphql'

const deletableTask = tasksFixture.find((task) => task.id === 'task-1')

if (!deletableTask) {
  throw new Error('Expected fixture task-1 to exist')
}

function exactly(text: string) {
  return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`)
}

test.beforeEach(async ({ page }) => {
  await mockTasksQuery(page)
  await page.goto('/')
})

function cardNameLocator(page: Page, taskName: string) {
  return page.getByTestId('task-card-name').filter({ hasText: exactly(taskName) })
}

async function openDeleteDialog(page: Page, taskName: string): Promise<Locator> {
  const card = page.getByTestId('task-card').filter({ has: cardNameLocator(page, taskName) })
  await card.getByRole('button', { name: 'Task options' }).click()
  await page.getByRole('button', { name: 'Delete' }).click()
  return page.getByRole('dialog')
}

async function confirmDelete(page: Page, taskName: string) {
  const dialog = await openDeleteDialog(page, taskName)
  await dialog.getByRole('button', { name: exactly('Delete') }).click()
}

test('clicking delete opens a confirmation dialog', async ({ page }) => {
  const dialog = await openDeleteDialog(page, deletableTask.name)

  await expect(dialog).toBeVisible()
  await expect(dialog.getByText(deletableTask.name)).toBeVisible()
  await expect(dialog.getByRole('button', { name: exactly('Delete') })).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeVisible()
})

test('cancelling the confirmation dialog leaves the card untouched', async ({ page }) => {
  const dialog = await openDeleteDialog(page, deletableTask.name)

  await dialog.getByRole('button', { name: 'Cancel' }).click()

  await expect(dialog).toBeHidden()
  await expect(cardNameLocator(page, deletableTask.name)).toBeVisible()
})

test('deleting a task removes its card from the board', async ({ page }) => {
  await expect(cardNameLocator(page, deletableTask.name)).toBeVisible()
  const totalCards = await page.getByTestId('task-card').count()

  await mockDeleteTaskMutation(page, { deleteTask: { id: deletableTask.id } })

  await confirmDelete(page, deletableTask.name)

  await expect(cardNameLocator(page, deletableTask.name)).toHaveCount(0)
  await expect(page.getByTestId('task-card')).toHaveCount(totalCards - 1)
  await expect(page.getByRole('status').filter({ hasText: 'Task deleted' })).toBeVisible()
})

test('deleting a task does not affect other cards on the board', async ({ page }) => {
  const otherTask = tasksFixture.find((task) => task.id === 'task-2')
  if (!otherTask) {
    throw new Error('Expected fixture task-2 to exist')
  }

  await mockDeleteTaskMutation(page, { deleteTask: { id: deletableTask.id } })

  await confirmDelete(page, deletableTask.name)

  await expect(cardNameLocator(page, deletableTask.name)).toHaveCount(0)
  await expect(cardNameLocator(page, otherTask.name)).toBeVisible()
})

test('a server error on delete keeps the card on the board and the dialog open', async ({
  page,
}) => {
  await mockDeleteTaskMutation(page, {
    errors: [{ message: 'Internal server error' }],
  })

  const dialog = await openDeleteDialog(page, deletableTask.name)
  await dialog.getByRole('button', { name: exactly('Delete') }).click()

  // handleConfirmDelete only closes the dialog and shows a success toast when the mutation
  // resolves. On a rejected mutation the dialog stays open (no auto-close) so the user can
  // retry or cancel, and the card remains exactly as it was.
  await expect(page.getByRole('status').filter({ hasText: 'Failed to delete task' })).toBeVisible()
  await expect(dialog).toBeVisible()
  await expect(cardNameLocator(page, deletableTask.name)).toBeVisible()
})

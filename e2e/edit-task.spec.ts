import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { tasksFixture } from '../src/features/tasks/fixtures/tasks'
import { mockTasksQuery, mockUpdateTaskMutation } from './mocks/graphql'

const editableTask = tasksFixture.find((task) => task.id === 'task-12')

if (!editableTask) {
  throw new Error('Expected fixture task-12 to exist')
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

async function openEditModal(page: Page, taskName: string) {
  const card = page.getByTestId('task-card').filter({ has: cardNameLocator(page, taskName) })
  await card.getByRole('button', { name: 'Task options' }).click()
  await page.getByRole('button', { name: 'Edit' }).click()
  return page.getByRole('dialog')
}

test('editing a task updates its name on the board', async ({ page }) => {
  const dialog = await openEditModal(page, editableTask.name)

  const nameInput = dialog.getByPlaceholder('Task Title')
  await expect(nameInput).toHaveValue(editableTask.name)

  const newName = 'Sync up with backend team'
  await nameInput.fill(newName)

  await mockUpdateTaskMutation(page, {
    updateTask: {
      ...editableTask,
      name: newName,
    },
  })

  await dialog.getByRole('button', { name: 'Update' }).click()

  await expect(dialog).toBeHidden()
  await expect(cardNameLocator(page, newName)).toBeVisible()
  await expect(cardNameLocator(page, editableTask.name)).toHaveCount(0)
})

test('the submit button is disabled when the task name is cleared', async ({ page }) => {
  const dialog = await openEditModal(page, editableTask.name)

  const nameInput = dialog.getByPlaceholder('Task Title')
  await nameInput.fill('')

  const submitButton = dialog.getByRole('button', { name: 'Update' })
  await expect(submitButton).toBeDisabled()

  // The dialog stays open and the board is untouched since the mutation never fires.
  await expect(dialog).toBeVisible()
  await expect(cardNameLocator(page, editableTask.name)).toBeVisible()
})

test('a server error on update keeps the modal open and the card unchanged', async ({ page }) => {
  const dialog = await openEditModal(page, editableTask.name)

  const nameInput = dialog.getByPlaceholder('Task Title')
  const newName = 'Sync up with backend team'
  await nameInput.fill(newName)

  await mockUpdateTaskMutation(page, {
    errors: [{ message: 'Internal server error' }],
  })

  await dialog.getByRole('button', { name: 'Update' }).click()

  // There is no error handling in TaskFormModal's onSubmit: it awaits updateTask with no
  // try/catch, so a rejected mutation promise throws before handleClose() runs. The
  // observable effect is that the dialog never closes and the card keeps its original name.
  await expect(dialog).toBeVisible()
  await expect(cardNameLocator(page, editableTask.name)).toBeVisible()
  await expect(cardNameLocator(page, newName)).toHaveCount(0)
})

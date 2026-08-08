import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { tasksFixture } from '../src/features/tasks/fixtures/tasks'
import { mockProfileQuery, mockTasksQuery, mockUpdateTaskMutation } from './mocks/graphql'

const editableTask = tasksFixture.find((task) => task.id === 'task-12')

if (!editableTask) {
  throw new Error('Expected fixture task-12 to exist')
}

function exactly(text: string) {
  return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`)
}

test.beforeEach(async ({ page }) => {
  await mockProfileQuery(page)
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
  await expect(page.getByRole('status').filter({ hasText: 'Task updated' })).toBeVisible()
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

test('editing a task due date changes the due-date pill color', async ({ page }) => {
  // Pin "now" so the on-time/soon/overdue tone (computed relative to `new Date()` in
  // dueDate.ts) is deterministic no matter when this test actually runs.
  const fixedNow = new Date('2026-01-15T10:00:00.000Z')
  const onTimeDueDate = new Date(Date.UTC(2026, 0, 20)) // 5 days after fixedNow -> onTime
  const overdueDueDate = new Date(Date.UTC(2026, 0, 13)) // 2 days before fixedNow -> overdue

  await page.clock.setFixedTime(fixedNow)
  await mockTasksQuery(
    page,
    tasksFixture.map((task) =>
      task.id === editableTask.id
        ? { ...editableTask, dueDate: onTimeDueDate.toISOString() }
        : task,
    ),
  )
  await page.goto('/')

  const card = page
    .getByTestId('task-card')
    .filter({ has: cardNameLocator(page, editableTask.name) })
  const dueDatePill = card.getByTestId('due-date')

  await expect(dueDatePill).toHaveCSS('background-color', 'rgb(0, 128, 96)')

  const dialog = await openEditModal(page, editableTask.name)

  // `timeZone: 'UTC'` keeps this label in sync with the DatePicker's rendering, which builds
  // its label from the due date's UTC year/month/day components without ever converting them.
  const currentDateLabel = onTimeDueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
  await dialog.getByRole('button', { name: currentDateLabel }).click()

  const overdueDay = String(overdueDueDate.getUTCDate())
  await page
    .getByRole('button', { name: overdueDay, exact: true })
    .and(page.locator('[data-in-month="true"]'))
    .click()

  await mockUpdateTaskMutation(page, {
    updateTask: {
      ...editableTask,
      dueDate: overdueDueDate.toISOString(),
    },
  })

  await dialog.getByRole('button', { name: 'Update' }).click()

  await expect(dialog).toBeHidden()
  await expect(dueDatePill).toHaveCSS('background-color', 'rgb(216, 44, 13)')
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

  await expect(page.getByText('Something went wrong updating this task.')).toBeVisible()
  await expect(page.getByRole('status').filter({ hasText: 'Failed to update task' })).toBeVisible()
  await expect(dialog).toBeVisible()
  await expect(cardNameLocator(page, editableTask.name)).toBeVisible()
  await expect(cardNameLocator(page, newName)).toHaveCount(0)
})

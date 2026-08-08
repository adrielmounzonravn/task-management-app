import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import { tasksFixture } from '../src/features/tasks/fixtures/tasks'
import {
  mockCreateTaskMutation,
  mockProfileQuery,
  mockTasksQuery,
  mockUpdateTaskMutation,
} from './mocks/graphql'

// Covers the `status` dropdown and `position` input added to TaskFormModal. `edit-task.spec.ts`
// and `create-task.spec.ts` already cover the `name` field end-to-end (success, server error,
// retry), so this file focuses on what's new instead of duplicating that coverage.

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

// TaskColumn renders its label as "<Label> (<count>)". There's no test id on the column, so we
// locate it by that title text and walk up to its container to scope card assertions to it.
function columnLocator(page: Page, label: string) {
  return page.getByText(new RegExp(`^${label} \\(\\d+\\)$`)).locator('..')
}

async function openEditModal(page: Page, taskName: string) {
  const card = page.getByTestId('task-card').filter({ has: cardNameLocator(page, taskName) })
  await card.getByRole('button', { name: 'Task options' }).click()
  await page.getByRole('button', { name: 'Edit' }).click()
  return page.getByRole('dialog')
}

// The status Dropdown.Trigger shows the currently selected label, and Dropdown.Panel is
// rendered via createPortal into document.body (outside the dialog's DOM subtree), so the
// option button has to be found via a page-level locator rather than scoped to the dialog.
async function selectStatus(page: Page, dialog: Locator, currentLabel: string, newLabel: string) {
  await dialog.getByRole('button', { name: currentLabel, exact: true }).click()
  await page.getByRole('listbox').getByRole('button', { name: newLabel, exact: true }).click()
}

test.describe('status field', () => {
  test('changing the status on an existing task moves it to the new column and sends it to updateTask', async ({
    page,
  }) => {
    const dialog = await openEditModal(page, editableTask.name)

    await selectStatus(page, dialog, 'In Progress', 'Done')

    await mockUpdateTaskMutation(page, {
      updateTask: { ...editableTask, status: 'DONE' },
    })

    const updateRequestPromise = page.waitForRequest(
      (request) =>
        request.url().includes('/graphql') &&
        request.postDataJSON()?.operationName === 'UpdateTask',
    )
    await dialog.getByRole('button', { name: 'Update' }).click()

    const updateRequest = await updateRequestPromise
    expect(updateRequest.postDataJSON().variables.input.status).toBe('DONE')

    await expect(dialog).toBeHidden()
    await expect(
      columnLocator(page, 'Done')
        .getByTestId('task-card-name')
        .filter({ hasText: exactly(editableTask.name) }),
    ).toBeVisible()
    await expect(
      columnLocator(page, 'In Progress')
        .getByTestId('task-card-name')
        .filter({ hasText: exactly(editableTask.name) }),
    ).toHaveCount(0)
  })

  test('creating a task with a non-default status sends it to createTask and places it in the right column', async ({
    page,
  }) => {
    const newTaskName = 'Investigate flaky CI runner on the release branch'
    const createdTask = {
      id: 'task-new-in-progress',
      name: newTaskName,
      pointEstimate: 'ONE' as const,
      position: 0,
      status: 'IN_PROGRESS' as const,
      dueDate: new Date().toISOString(),
      tags: [],
      assignee: null,
    }

    await page.getByRole('button', { name: 'Add task' }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByPlaceholder('Task Title').fill(newTaskName)

    await selectStatus(page, dialog, 'Backlog', 'In Progress')

    await mockCreateTaskMutation(page, { createTask: createdTask })

    const createRequestPromise = page.waitForRequest(
      (request) =>
        request.url().includes('/graphql') &&
        request.postDataJSON()?.operationName === 'CreateTask',
    )
    await dialog.getByRole('button', { name: 'Create' }).click()

    const createRequest = await createRequestPromise
    expect(createRequest.postDataJSON().variables.input.status).toBe('IN_PROGRESS')

    await expect(dialog).toBeHidden()
    await expect(
      columnLocator(page, 'In Progress')
        .getByTestId('task-card-name')
        .filter({ hasText: exactly(newTaskName) }),
    ).toBeVisible()
  })
})

test.describe('position field', () => {
  test('is not rendered when creating a task', async ({ page }) => {
    await page.getByRole('button', { name: 'Add task' }).click()
    const dialog = page.getByRole('dialog')

    await expect(dialog.locator('#task-position')).toHaveCount(0)
  })

  test('changing the position on an existing task sends it to updateTask', async ({ page }) => {
    const dialog = await openEditModal(page, editableTask.name)

    const positionInput = dialog.locator('#task-position')
    await expect(positionInput).toHaveValue(String(editableTask.position))
    await positionInput.fill('5')

    await mockUpdateTaskMutation(page, {
      updateTask: { ...editableTask, position: 5 },
    })

    const updateRequestPromise = page.waitForRequest(
      (request) =>
        request.url().includes('/graphql') &&
        request.postDataJSON()?.operationName === 'UpdateTask',
    )
    await dialog.getByRole('button', { name: 'Update' }).click()

    const updateRequest = await updateRequestPromise
    expect(updateRequest.postDataJSON().variables.input.position).toBe(5)
    await expect(dialog).toBeHidden()
  })

  test('filters out non-digit characters as they are typed', async ({ page }) => {
    const dialog = await openEditModal(page, editableTask.name)

    const positionInput = dialog.locator('#task-position')
    await positionInput.fill('12a3b')

    await expect(positionInput).toHaveValue('123')
  })

  test('rejects zero, showing a validation error and disabling the update button', async ({
    page,
  }) => {
    const dialog = await openEditModal(page, editableTask.name)

    // Guard rail: this mutation must never actually fire, since validation should block the
    // submit. Mocking an error response makes sure that if it did fire (a regression), the test
    // fails loudly instead of hitting the real API.
    await mockUpdateTaskMutation(page, { errors: [{ message: 'should not be called' }] })

    const positionInput = dialog.locator('#task-position')
    await positionInput.fill('0')

    const updateButton = dialog.getByRole('button', { name: 'Update' })
    await updateButton.click()

    await expect(page.getByText('Position must be a positive whole number.')).toBeVisible()
    await expect(updateButton).toBeDisabled()
    await expect(dialog).toBeVisible()
    await expect(cardNameLocator(page, editableTask.name)).toBeVisible()
  })
})

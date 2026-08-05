import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

// This spec hits the real GraphQL API (no page.route interception) as a smoke test of the
// create -> edit -> delete integration. It is intentionally the only test in this file: it is
// slow and non-deterministic (real network latency), so it covers the full flow once rather
// than being split into several small tests. Exhaustive UI behavior is already covered by the
// mocked specs.
test.setTimeout(90_000)

function exactly(text: string) {
  return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`)
}

function cardNameLocator(page: Page, taskName: string) {
  return page.getByTestId('task-card-name').filter({ hasText: exactly(taskName) })
}

function cardLocator(page: Page, taskName: string) {
  return page.getByTestId('task-card').filter({ has: cardNameLocator(page, taskName) })
}

async function deleteCardIfPresent(page: Page, taskName: string) {
  const card = cardLocator(page, taskName)
  if ((await card.count()) === 0) return false

  await card.getByRole('button', { name: 'Task options' }).click()
  await page.getByRole('button', { name: 'Delete' }).click()
  await expect(cardNameLocator(page, taskName)).toHaveCount(0, { timeout: 15_000 })
  return true
}

test('creating, editing, and deleting a task works end-to-end against the live API', async ({
  page,
}) => {
  // Unique, easily identifiable name so this never gets confused with real data from other
  // users of the shared, productive API.
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const createdName = `[e2e-live] ${runId}`
  const updatedName = `[e2e-live] ${runId} (edited)`

  let createdTaskId: string | undefined

  await page.goto('/')

  try {
    await page.getByRole('button', { name: 'Add task' }).click()
    const createDialog = page.getByRole('dialog')
    await createDialog.getByPlaceholder('Task Title').fill(createdName)

    const createResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/graphql') &&
        response.request().postDataJSON()?.operationName === 'CreateTask',
    )
    await createDialog.getByRole('button', { name: 'Create' }).click()

    const createResponse = await createResponsePromise
    const createBody = await createResponse.json()
    createdTaskId = createBody?.data?.createTask?.id
    expect(
      createBody?.errors,
      `CreateTask returned errors: ${JSON.stringify(createBody?.errors)}`,
    ).toBeUndefined()

    await expect(createDialog).toBeHidden()
    await expect(cardNameLocator(page, createdName)).toBeVisible({ timeout: 15_000 })

    // Edit: open the card's dropdown, switch to edit mode, and rename it.
    const card = cardLocator(page, createdName)
    await card.getByRole('button', { name: 'Task options' }).click()
    await page.getByRole('button', { name: 'Edit' }).click()

    const editDialog = page.getByRole('dialog')
    const nameInput = editDialog.getByPlaceholder('Task Title')
    await expect(nameInput).toHaveValue(createdName)
    await nameInput.fill(updatedName)

    const updateResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/graphql') &&
        response.request().postDataJSON()?.operationName === 'UpdateTask',
    )
    await editDialog.getByRole('button', { name: 'Update' }).click()

    const updateResponse = await updateResponsePromise
    const updateBody = await updateResponse.json()
    expect(
      updateBody?.errors,
      `UpdateTask returned errors: ${JSON.stringify(updateBody?.errors)}`,
    ).toBeUndefined()

    await expect(editDialog).toBeHidden()
    await expect(cardNameLocator(page, updatedName)).toBeVisible({ timeout: 15_000 })
    await expect(cardNameLocator(page, createdName)).toHaveCount(0)

    // Delete: remove the card via the dropdown and confirm it's gone from the board.
    const deleteResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/graphql') &&
        response.request().postDataJSON()?.operationName === 'DeleteTask',
    )
    const deleted = await deleteCardIfPresent(page, updatedName)
    expect(deleted, 'Expected the updated task card to be present before deleting it').toBe(true)

    const deleteResponse = await deleteResponsePromise
    const deleteBody = await deleteResponse.json()
    expect(
      deleteBody?.errors,
      `DeleteTask returned errors: ${JSON.stringify(deleteBody?.errors)}`,
    ).toBeUndefined()
  } finally {
    // Guaranteed cleanup: no matter what failed above (or whether the delete step in the
    // happy path already ran), make sure this run's task doesn't linger on the shared API.
    // Close any dialog left open by a failed assertion so it doesn't block the dropdown click.
    await page.keyboard.press('Escape').catch(() => {})

    try {
      await deleteCardIfPresent(page, updatedName)
      await deleteCardIfPresent(page, createdName)
    } catch (cleanupError) {
      console.error(
        `[e2e-live] Cleanup via UI threw for task id=${createdTaskId ?? 'unknown'} (names: "${createdName}" / "${updatedName}"):`,
        cleanupError,
      )
    }

    const stillPresent =
      (await cardLocator(page, updatedName).count()) > 0 ||
      (await cardLocator(page, createdName).count()) > 0

    if (stillPresent) {
      console.error(
        `[e2e-live] Could not confirm cleanup of live test task. Please verify and delete manually: ` +
          `id=${createdTaskId ?? 'unknown'}, name="${createdName}" or "${updatedName}"`,
      )
    }
  }
})

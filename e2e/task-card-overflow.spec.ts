import { expect, test } from '@playwright/test'
import { tasksFixture } from '../src/features/tasks/fixtures/tasks'

const shortNameTask = tasksFixture.find((task) => task.id === 'task-12')
const longNameTask = tasksFixture.find((task) => task.id === 'task-11')

if (!shortNameTask || !longNameTask) {
  throw new Error('Expected fixtures task-11 and task-12 to exist')
}

function exactly(text: string) {
  return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('all task cards render at the same fixed size', async ({ page }) => {
  const cards = page.getByTestId('task-card')
  const count = await cards.count()
  expect(count).toBeGreaterThan(1)

  const heights = new Set<number>()
  for (let i = 0; i < count; i++) {
    const box = await cards.nth(i).boundingBox()
    if (box) heights.add(Math.round(box.height))
  }

  expect(heights.size).toBe(1)
})

test('a short task name renders in full, without truncation', async ({ page }) => {
  const name = page.getByTestId('task-card-name').filter({ hasText: exactly(shortNameTask.name) })
  await expect(name).toHaveText(shortNameTask.name)

  const { scrollHeight, clientHeight } = await name.evaluate((el) => ({
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
  }))

  expect(scrollHeight).toBeLessThanOrEqual(clientHeight)
})

test('a long task name is clamped instead of overflowing the card', async ({ page }) => {
  const card = page.getByTestId('task-card').filter({ hasText: longNameTask.name })
  const name = card.getByTestId('task-card-name')

  // The full name is still in the DOM (accessible to assistive tech / tests)...
  await expect(name).toHaveText(longNameTask.name)

  // ...and the native tooltip exposes it in full on hover.
  await expect(name).toHaveAttribute('title', longNameTask.name)

  // ...but visually it is clipped to its allotted box instead of growing past it.
  const { scrollHeight, clientHeight } = await name.evaluate((el) => ({
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
  }))
  expect(scrollHeight).toBeGreaterThan(clientHeight)

  // And the card itself never grows taller than its fixed size to accommodate it.
  const cardBox = await card.boundingBox()
  const nameBox = await name.boundingBox()
  expect(cardBox).not.toBeNull()
  expect(nameBox).not.toBeNull()
  if (cardBox && nameBox) {
    expect(nameBox.y + nameBox.height).toBeLessThanOrEqual(cardBox.y + cardBox.height)
  }
})

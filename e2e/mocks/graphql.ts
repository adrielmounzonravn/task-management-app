import type { Page } from '@playwright/test'
import type { TasksQuery } from '../../src/gql/graphql'
import { tasksFixture } from '../../src/features/tasks/fixtures/tasks'

const GRAPHQL_ENDPOINT = '**/graphql'

export async function mockTasksQuery(page: Page, tasks: TasksQuery['tasks'] = tasksFixture) {
  await page.route(GRAPHQL_ENDPOINT, async (route) => {
    const request = route.request()
    const body = request.postDataJSON() as { operationName?: string }

    if (body.operationName !== 'Tasks') {
      await route.fallback()
      return
    }

    await route.fulfill({ json: { data: { tasks } satisfies TasksQuery } })
  })
}

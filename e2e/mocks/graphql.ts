import type { Page } from '@playwright/test'
import type { TasksQuery, UpdateTaskMutation } from '../../src/gql/graphql'
import { tasksFixture } from '../../src/features/tasks/fixtures/tasks'

const GRAPHQL_ENDPOINT = '**/graphql'

// The real API adds `__typename` to every object because Apollo Client's HttpLink transforms
// outgoing queries to request it, regardless of what the hand-written document asks for. That
// `__typename` + `id` pair is what lets Apollo's InMemoryCache normalize entities and merge a
// mutation response into an already-rendered query result. Our generated TS types omit
// `__typename` for readability, so mocked responses have to add it back by hand to behave like
// the real server and exercise normalization the same way production does.
function withTaskTypename<T extends TasksQuery['tasks'][number]>(task: T) {
  return {
    ...task,
    __typename: 'Task' as const,
    assignee: task.assignee ? { ...task.assignee, __typename: 'User' as const } : null,
  }
}

export async function mockTasksQuery(page: Page, tasks: TasksQuery['tasks'] = tasksFixture) {
  await page.route(GRAPHQL_ENDPOINT, async (route) => {
    const request = route.request()
    const body = request.postDataJSON() as { operationName?: string }

    if (body.operationName !== 'Tasks') {
      await route.fallback()
      return
    }

    await route.fulfill({ json: { data: { tasks: tasks.map(withTaskTypename) } } })
  })
}

type GraphQLError = { message: string }

export async function mockUpdateTaskMutation(
  page: Page,
  response: UpdateTaskMutation | { errors: GraphQLError[] },
) {
  await page.route(GRAPHQL_ENDPOINT, async (route) => {
    const request = route.request()
    const body = request.postDataJSON() as { operationName?: string }

    if (body.operationName !== 'UpdateTask') {
      await route.fallback()
      return
    }

    if ('errors' in response) {
      await route.fulfill({ json: { errors: response.errors } })
      return
    }

    await route.fulfill({
      json: { data: { updateTask: withTaskTypename(response.updateTask) } },
    })
  })
}

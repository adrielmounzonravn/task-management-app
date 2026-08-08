import type { Page } from '@playwright/test'
import type {
  CreateTaskMutation,
  DeleteTaskMutation,
  ProfileQuery,
  TasksQuery,
  UpdateTaskMutation,
} from '../../src/gql/graphql'
import { tasksFixture } from '../../src/features/tasks/fixtures/tasks'

const GRAPHQL_ENDPOINT = '**/graphql'

const profileFixture: ProfileQuery['profile'] = {
  id: '2adcaf27-5de6-4500-b795-166f482fdace',
  fullName: 'Adriel Mounzón',
  email: 'adriel@example.com',
  avatar: null,
  type: 'ADMIN',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

export async function mockProfileQuery(
  page: Page,
  response: ProfileQuery['profile'] = profileFixture,
) {
  await page.route(GRAPHQL_ENDPOINT, async (route) => {
    const request = route.request()
    const body = request.postDataJSON() as { operationName?: string }

    if (body.operationName !== 'Profile') {
      await route.fallback()
      return
    }

    await route.fulfill({
      json: { data: { profile: { ...response, __typename: 'User' as const } } },
    })
  })
}

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

type GraphQLError = { message: string; extensions?: { code: string } }

export async function mockTasksQuery(
  page: Page,
  response: TasksQuery['tasks'] | { errors: GraphQLError[] } = tasksFixture,
) {
  await page.route(GRAPHQL_ENDPOINT, async (route) => {
    const request = route.request()
    const body = request.postDataJSON() as { operationName?: string }

    if (body.operationName !== 'Tasks') {
      await route.fallback()
      return
    }

    if ('errors' in response) {
      await route.fulfill({ json: { errors: response.errors } })
      return
    }

    await route.fulfill({ json: { data: { tasks: response.map(withTaskTypename) } } })
  })
}

export async function mockCreateTaskMutation(
  page: Page,
  response: CreateTaskMutation | { errors: GraphQLError[] },
) {
  await page.route(GRAPHQL_ENDPOINT, async (route) => {
    const request = route.request()
    const body = request.postDataJSON() as { operationName?: string }

    if (body.operationName !== 'CreateTask') {
      await route.fallback()
      return
    }

    if ('errors' in response) {
      await route.fulfill({ json: { errors: response.errors } })
      return
    }

    await route.fulfill({
      json: { data: { createTask: withTaskTypename(response.createTask) } },
    })
  })
}

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

export async function mockDeleteTaskMutation(
  page: Page,
  response: DeleteTaskMutation | { errors: GraphQLError[] },
) {
  await page.route(GRAPHQL_ENDPOINT, async (route) => {
    const request = route.request()
    const body = request.postDataJSON() as { operationName?: string }

    if (body.operationName !== 'DeleteTask') {
      await route.fallback()
      return
    }

    if ('errors' in response) {
      await route.fulfill({ json: { errors: response.errors } })
      return
    }

    // useDeleteTask's `update` callback calls `cache.identify(deleted)` to build the
    // `Task:<id>` cache key to evict. `cache.identify` needs both `__typename` and `id`, so
    // (like `withTaskTypename` above) we have to add `__typename` back by hand here too —
    // the real HttpLink would have requested it from the server automatically.
    await route.fulfill({
      json: { data: { deleteTask: { ...response.deleteTask, __typename: 'Task' as const } } },
    })
  })
}

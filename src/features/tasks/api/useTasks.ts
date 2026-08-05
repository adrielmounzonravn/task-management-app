import { useSuspenseQuery } from '@apollo/client/react'
import { GET_TASKS } from '@/features/tasks/api/queries'
import type { FilterTaskInput } from '@/gql/graphql'

export function useTasks(input: FilterTaskInput) {
  const { data } = useSuspenseQuery(GET_TASKS, { variables: { input } })

  return data.tasks
}

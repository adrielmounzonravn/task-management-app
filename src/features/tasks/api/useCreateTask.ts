import { useMutation } from '@apollo/client/react'
import { CREATE_TASK } from '@/features/tasks/api/mutations'
import type { CreateTaskInput } from '@/gql/graphql'

export function useCreateTask() {
  const [createTask, { loading }] = useMutation(CREATE_TASK, {
    refetchQueries: ['Tasks'],
  })

  return {
    createTask: (input: CreateTaskInput) => createTask({ variables: { input } }),
    loading,
  }
}

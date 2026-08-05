import { useMutation } from '@apollo/client/react'
import { UPDATE_TASK } from '@/features/tasks/api/mutations'
import type { UpdateTaskInput } from '@/gql/graphql'

export function useUpdateTask() {
  const [updateTask, { loading }] = useMutation(UPDATE_TASK)

  return {
    updateTask: (input: UpdateTaskInput) => updateTask({ variables: { input } }),
    loading,
  }
}

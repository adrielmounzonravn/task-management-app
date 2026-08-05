import { useMutation } from '@apollo/client/react'
import { CREATE_TASK } from '@/features/tasks/api/mutations'
import type { CreateTaskInput } from '@/gql/graphql'

export function useCreateTask() {
  const [createTask, { loading }] = useMutation(CREATE_TASK, {
    update(cache, { data }) {
      const created = data?.createTask
      if (!created) return

      cache.modify({
        fields: {
          tasks(existingRefs = [], { toReference }) {
            const newRef = toReference(created)
            return newRef ? [newRef, ...existingRefs] : existingRefs
          },
        },
      })
    },
  })

  return {
    createTask: (input: CreateTaskInput) => createTask({ variables: { input } }),
    loading,
  }
}

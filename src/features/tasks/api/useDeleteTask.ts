import { useMutation } from '@apollo/client/react'
import { DELETE_TASK } from '@/features/tasks/api/mutations'

export function useDeleteTask() {
  const [deleteTask, { loading }] = useMutation(DELETE_TASK, {
    update(cache, { data }) {
      const deleted = data?.deleteTask
      if (!deleted) return

      cache.evict({ id: cache.identify(deleted) })
      cache.gc()
    },
  })

  return {
    deleteTask: (id: string) => deleteTask({ variables: { input: { id } } }),
    loading,
  }
}

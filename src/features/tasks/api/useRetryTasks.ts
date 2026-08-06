import { useApolloClient } from '@apollo/client/react'

export function useRetryTasks() {
  const client = useApolloClient()

  return () => client.refetchQueries({ include: ['Tasks'] })
}

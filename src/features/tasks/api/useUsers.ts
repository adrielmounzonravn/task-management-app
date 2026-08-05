import { useApolloClient, useQuery } from '@apollo/client/react'
import { GET_USERS } from '@/features/tasks/api/queries'

export function useUsers() {
  const { data, loading } = useQuery(GET_USERS)

  return { users: data?.users, loading }
}

export function usePrefetchUsers() {
  const client = useApolloClient()

  return () => {
    client.query({ query: GET_USERS })
  }
}

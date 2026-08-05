import { useSuspenseQuery } from '@apollo/client/react'
import { GET_USERS } from '@/features/tasks/api/queries'

export function useUsers() {
  const { data } = useSuspenseQuery(GET_USERS)

  return data.users
}

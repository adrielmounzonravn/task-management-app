import { useSuspenseQuery } from '@apollo/client/react'
import { GET_PROFILE } from '@/features/profile/api/queries'

export function useProfile() {
  const { data } = useSuspenseQuery(GET_PROFILE)

  return data.profile
}

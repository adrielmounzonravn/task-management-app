import type { UserType } from '@/gql/graphql'

const USER_TYPE_LABELS: Record<UserType, string> = {
  ADMIN: 'Admin',
  CANDIDATE: 'Candidate',
}

export function getUserTypeLabel(type: UserType) {
  return USER_TYPE_LABELS[type]
}

import type { Status } from '@/gql/graphql'

export const STATUS_COLUMNS: { status: Status; label: string }[] = [
  { status: 'BACKLOG', label: 'Backlog' },
  { status: 'TODO', label: 'Todo' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'DONE', label: 'Done' },
  { status: 'CANCELLED', label: 'Cancelled' },
]

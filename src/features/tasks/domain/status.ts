import type { Status } from '@/gql/graphql'
import type { Task } from '@/features/tasks/fixtures/tasks'

export const STATUS_COLUMNS: { status: Status; label: string }[] = [
  { status: 'BACKLOG', label: 'Backlog' },
  { status: 'TODO', label: 'Todo' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'DONE', label: 'Done' },
  { status: 'CANCELLED', label: 'Cancelled' },
]

export function getTasksByStatus(tasks: Task[], status: Status) {
  return tasks.filter((task) => task.status === status)
}

export function getTasksByAssignee(tasks: Task[], assigneeId: string) {
  return tasks.filter((task) => task.assignee?.id === assigneeId)
}

export function getTasksBySearch(tasks: Task[], search: string) {
  const normalizedSearch = search.trim().toLowerCase()
  if (!normalizedSearch) return tasks

  return tasks.filter((task) => task.name.toLowerCase().includes(normalizedSearch))
}

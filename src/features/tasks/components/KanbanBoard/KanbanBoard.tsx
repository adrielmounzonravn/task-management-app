import { TaskColumn } from '@/features/tasks/components/TaskColumn/TaskColumn'

export function KanbanBoard() {
  return (
    <div>
      <TaskColumn />
      <TaskColumn />
      <TaskColumn />
      <TaskColumn />
      <TaskColumn />
    </div>
  )
}

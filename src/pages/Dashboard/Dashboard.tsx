import { KanbanBoard } from '@/features/tasks/components/KanbanBoard/KanbanBoard'
import { TasksToolbar } from '@/features/tasks/components/TasksToolbar/TasksToolbar'

export function Dashboard() {
  return (
    <>
      <TasksToolbar />
      <KanbanBoard />
    </>
  )
}

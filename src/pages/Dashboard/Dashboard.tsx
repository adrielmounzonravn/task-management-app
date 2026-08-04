import { TasksToolbar } from '@/features/tasks/components/TasksToolbar/TasksToolbar'
import { TasksView } from '@/features/tasks/components/TasksView/TasksView'

export function Dashboard() {
  return (
    <>
      <TasksToolbar />
      <TasksView />
    </>
  )
}

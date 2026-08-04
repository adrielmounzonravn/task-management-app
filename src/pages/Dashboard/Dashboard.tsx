import { TaskList } from '@/features/tasks/components/TaskList/TaskList'
import { TasksToolbar } from '@/features/tasks/components/TasksToolbar/TasksToolbar'

export function Dashboard() {
  return (
    <>
      <TasksToolbar />
      <TaskList />
    </>
  )
}

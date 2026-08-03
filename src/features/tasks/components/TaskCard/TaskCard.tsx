import { TaskLabel } from '@/features/tasks/components/TaskLabel/TaskLabel'
import { DueDate } from '@/features/tasks/components/DueDate/DueDate'

export function TaskCard() {
  return (
    <div>
      <TaskLabel />
      <TaskLabel />
      <DueDate />
    </div>
  )
}

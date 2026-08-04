import { KanbanBoard } from '@/features/tasks/components/KanbanBoard/KanbanBoard'
import { TaskList } from '@/features/tasks/components/TaskList/TaskList'
import { useTaskView } from '@/features/tasks/useTaskView'

type TasksViewProps = {
  assigneeId?: string
}

export function TasksView({ assigneeId }: TasksViewProps) {
  const { view } = useTaskView()

  return view === 'list' ? (
    <TaskList assigneeId={assigneeId} />
  ) : (
    <KanbanBoard assigneeId={assigneeId} />
  )
}

import { TaskColumn } from '@/features/tasks/components/TaskColumn/TaskColumn'
import { STATUS_COLUMNS, getTasksByStatus } from '@/features/tasks/domain/status'
import { useTasks } from '@/features/tasks/api/useTasks'
import { useTaskSearch } from '@/features/tasks/useTaskSearch'
import styles from '@/features/tasks/components/KanbanBoard/KanbanBoard.module.css'

type KanbanBoardProps = {
  assigneeId?: string
}

export function KanbanBoard({ assigneeId }: KanbanBoardProps) {
  const search = useTaskSearch()
  const tasks = useTasks({ name: search || undefined, assigneeId })

  return (
    <div className={styles.board}>
      {STATUS_COLUMNS.map(({ status, label }) => (
        <TaskColumn key={status} label={label} tasks={getTasksByStatus(tasks, status)} />
      ))}
    </div>
  )
}

import { TaskColumn } from '@/features/tasks/components/TaskColumn/TaskColumn'
import {
  STATUS_COLUMNS,
  getTasksByAssignee,
  getTasksBySearch,
  getTasksByStatus,
} from '@/features/tasks/domain/status'
import { tasksFixture } from '@/features/tasks/fixtures/tasks'
import { useTaskSearch } from '@/features/tasks/useTaskSearch'
import styles from '@/features/tasks/components/KanbanBoard/KanbanBoard.module.css'

type KanbanBoardProps = {
  assigneeId?: string
}

export function KanbanBoard({ assigneeId }: KanbanBoardProps) {
  const search = useTaskSearch()
  const tasksByAssignee = assigneeId ? getTasksByAssignee(tasksFixture, assigneeId) : tasksFixture
  const tasks = getTasksBySearch(tasksByAssignee, search)

  return (
    <div className={styles.board}>
      {STATUS_COLUMNS.map(({ status, label }) => (
        <TaskColumn key={status} label={label} tasks={getTasksByStatus(tasks, status)} />
      ))}
    </div>
  )
}

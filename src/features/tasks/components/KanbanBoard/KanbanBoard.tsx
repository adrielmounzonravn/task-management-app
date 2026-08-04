import { TaskColumn } from '@/features/tasks/components/TaskColumn/TaskColumn'
import {
  STATUS_COLUMNS,
  getTasksByAssignee,
  getTasksByStatus,
} from '@/features/tasks/domain/status'
import { tasksFixture } from '@/features/tasks/fixtures/tasks'
import styles from '@/features/tasks/components/KanbanBoard/KanbanBoard.module.css'

type KanbanBoardProps = {
  assigneeId?: string
}

export function KanbanBoard({ assigneeId }: KanbanBoardProps) {
  const tasks = assigneeId ? getTasksByAssignee(tasksFixture, assigneeId) : tasksFixture

  return (
    <div className={styles.board}>
      {STATUS_COLUMNS.map(({ status, label }) => (
        <TaskColumn key={status} label={label} tasks={getTasksByStatus(tasks, status)} />
      ))}
    </div>
  )
}

import { TaskColumn } from '@/features/tasks/components/TaskColumn/TaskColumn'
import { STATUS_COLUMNS, getTasksByStatus } from '@/features/tasks/domain/status'
import { tasksFixture } from '@/features/tasks/fixtures/tasks'
import styles from '@/features/tasks/components/KanbanBoard/KanbanBoard.module.css'

export function KanbanBoard() {
  return (
    <div className={styles.board}>
      {STATUS_COLUMNS.map(({ status, label }) => (
        <TaskColumn key={status} label={label} tasks={getTasksByStatus(tasksFixture, status)} />
      ))}
    </div>
  )
}

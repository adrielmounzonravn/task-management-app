import { TaskColumn } from '@/features/tasks/components/TaskColumn/TaskColumn'
import { STATUS_COLUMNS } from '@/features/tasks/domain/status'
import styles from '@/features/tasks/components/KanbanBoard/KanbanBoard.module.css'

const HARDCODED_TASK_COUNT = 3

export function KanbanBoard() {
  return (
    <div className={styles.board}>
      {STATUS_COLUMNS.map(({ status, label }) => (
        <TaskColumn key={status} label={label} taskCount={HARDCODED_TASK_COUNT} />
      ))}
    </div>
  )
}

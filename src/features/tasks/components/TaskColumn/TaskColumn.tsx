import { TaskCard } from '@/features/tasks/components/TaskCard/TaskCard'
import styles from '@/features/tasks/components/TaskColumn/TaskColumn.module.css'

type TaskColumnProps = {
  label: string
  taskCount: number
}

export function TaskColumn({ label, taskCount }: TaskColumnProps) {
  return (
    <div className={styles.column}>
      <span className={styles.title}>
        {label} ({taskCount.toString().padStart(2, '0')})
      </span>
      <div className={styles.list}>
        <TaskCard />
        <TaskCard />
      </div>
    </div>
  )
}

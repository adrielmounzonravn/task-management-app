import type { Task } from '@/features/tasks/fixtures/tasks'
import { TaskCard } from '@/features/tasks/components/TaskCard/TaskCard'
import styles from '@/features/tasks/components/TaskColumn/TaskColumn.module.css'

type TaskColumnProps = {
  label: string
  tasks: Task[]
}

export function TaskColumn({ label, tasks }: TaskColumnProps) {
  return (
    <div className={styles.column}>
      <span className={styles.title}>
        {label} ({tasks.length.toString().padStart(2, '0')})
      </span>
      <div className={styles.list}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}

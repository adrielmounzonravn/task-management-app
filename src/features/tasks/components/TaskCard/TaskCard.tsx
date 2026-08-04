import type { Task } from '@/features/tasks/fixtures/tasks'
import { TaskLabel } from '@/features/tasks/components/TaskLabel/TaskLabel'
import { DueDate } from '@/features/tasks/components/DueDate/DueDate'
import styles from '@/features/tasks/components/TaskCard/TaskCard.module.css'

type TaskCardProps = {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.name}>{task.name}</span>
      <div className={styles.tags}>
        {task.tags.map((tag) => (
          <TaskLabel key={tag} tag={tag} />
        ))}
      </div>
      <div className={styles.footer}>
        <span className={styles.assignee}>{task.assignee?.fullName ?? 'Unassigned'}</span>
        <DueDate dueDate={task.dueDate} />
      </div>
    </div>
  )
}

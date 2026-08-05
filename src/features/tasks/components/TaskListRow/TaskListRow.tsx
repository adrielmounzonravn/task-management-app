import type { Task } from '@/features/tasks/fixtures/tasks'
import { TaskLabel } from '@/features/tasks/components/TaskLabel/TaskLabel'
import { DueDate } from '@/features/tasks/components/DueDate/DueDate'
import { formatDueDate } from '@/features/tasks/domain/dueDate'
import { POINT_ESTIMATE_LABELS } from '@/features/tasks/domain/pointEstimate'
import styles from '@/features/tasks/components/TaskListRow/TaskListRow.module.css'

type TaskListRowProps = {
  task: Task
}

export function TaskListRow({ task }: TaskListRowProps) {
  const { tone } = formatDueDate(task.dueDate)

  return (
    <div role="row" className={`${styles.row} ${styles[tone]}`}>
      <span role="cell" className={styles.name}>
        {task.name}
      </span>
      <div role="cell" className={styles.tags}>
        {task.tags.map((tag) => (
          <TaskLabel key={tag} tag={tag} />
        ))}
      </div>
      <span role="cell" className={styles.estimate}>
        {POINT_ESTIMATE_LABELS[task.pointEstimate]}
      </span>
      <span role="cell" className={styles.assignee}>
        {task.assignee?.fullName ?? 'Unassigned'}
      </span>
      <span role="cell">
        <DueDate dueDate={task.dueDate} />
      </span>
    </div>
  )
}

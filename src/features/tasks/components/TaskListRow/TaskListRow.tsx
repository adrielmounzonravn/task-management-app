import type { Task } from '@/features/tasks/fixtures/tasks'
import { TaskLabel } from '@/features/tasks/components/TaskLabel/TaskLabel'
import { DueDate } from '@/features/tasks/components/DueDate/DueDate'
import { POINT_ESTIMATE_LABELS } from '@/features/tasks/domain/pointEstimate'
import styles from '@/features/tasks/components/TaskListRow/TaskListRow.module.css'

const ACCENT_TONES = ['one', 'two', 'three', 'four', 'five'] as const

type TaskListRowProps = {
  task: Task
  index: number
}

export function TaskListRow({ task, index }: TaskListRowProps) {
  const tone = ACCENT_TONES[index % ACCENT_TONES.length]

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

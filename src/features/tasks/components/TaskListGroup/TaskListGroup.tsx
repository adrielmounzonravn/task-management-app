import { useState } from 'react'
import type { Task } from '@/features/tasks/fixtures/tasks'
import { TaskListRow } from '@/features/tasks/components/TaskListRow/TaskListRow'
import styles from '@/features/tasks/components/TaskListGroup/TaskListGroup.module.css'

type TaskListGroupProps = {
  label: string
  tasks: Task[]
}

export function TaskListGroup({ label, tasks }: TaskListGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div role="rowgroup" className={styles.group}>
      <button
        type="button"
        className={styles.title}
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((current) => !current)}
      >
        <span className={isExpanded ? styles.chevronExpanded : styles.chevron}>
          <ChevronIcon />
        </span>
        {label} ({tasks.length.toString().padStart(2, '0')})
      </button>
      {isExpanded && (
        <div className={styles.rows}>
          {tasks.map((task, index) => (
            <TaskListRow key={task.id} task={task} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

import type { Task } from '@/features/tasks/fixtures/tasks'
import { TaskLabel } from '@/features/tasks/components/TaskLabel/TaskLabel'
import { DueDate } from '@/features/tasks/components/DueDate/DueDate'
import { ProfilePhoto } from '@/shared/ui/ProfilePhoto/ProfilePhoto'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { TaskOptionsIcon, EditIcon, DeleteIcon } from '@/shared/ui/icons'
import { POINT_ESTIMATE_LABELS } from '@/features/tasks/domain/pointEstimate'
import styles from '@/features/tasks/components/TaskCard/TaskCard.module.css'

type TaskCardProps = {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className={styles.card} data-testid="task-card">
      <div className={styles.header}>
        <span className={styles.name} data-testid="task-card-name" title={task.name}>
          {task.name}
        </span>
        <Dropdown>
          <Dropdown.Trigger className={styles.options} aria-label="Task options">
            <TaskOptionsIcon />
          </Dropdown.Trigger>
          <Dropdown.Panel>
            {(close) => (
              <>
                <button type="button" className={styles.menuItem} onClick={close}>
                  <EditIcon />
                  Edit
                </button>
                <button
                  type="button"
                  className={`${styles.menuItem} ${styles.menuItemDanger}`}
                  onClick={close}
                >
                  <DeleteIcon />
                  Delete
                </button>
              </>
            )}
          </Dropdown.Panel>
        </Dropdown>
      </div>
      <div className={styles.meta}>
        <span className={styles.points}>{POINT_ESTIMATE_LABELS[task.pointEstimate]}</span>
        <DueDate dueDate={task.dueDate} />
      </div>
      <div className={styles.tags}>
        {task.tags.map((tag) => (
          <TaskLabel key={tag} tag={tag} />
        ))}
      </div>
      <div className={styles.footer}>
        <ProfilePhoto size="sm" />
        <span className={styles.assignee}>{task.assignee?.fullName ?? 'Unassigned'}</span>
      </div>
    </div>
  )
}

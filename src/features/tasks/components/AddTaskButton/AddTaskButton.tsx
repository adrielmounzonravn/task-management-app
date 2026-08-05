import { AddTaskIcon } from '@/shared/ui/icons'
import styles from '@/features/tasks/components/AddTaskButton/AddTaskButton.module.css'

export function AddTaskButton() {
  return (
    <button type="button" className={styles.button} aria-label="Add task">
      <AddTaskIcon />
    </button>
  )
}

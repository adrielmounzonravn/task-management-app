import { AddTaskIcon } from '@/shared/ui/icons'
import styles from '@/features/tasks/components/AddTaskButton/AddTaskButton.module.css'

type AddTaskButtonProps = {
  onClick: () => void
  onMouseEnter?: () => void
}

export function AddTaskButton({ onClick, onMouseEnter }: AddTaskButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      aria-label="Add task"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <AddTaskIcon />
    </button>
  )
}

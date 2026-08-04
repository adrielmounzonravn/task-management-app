import styles from '@/features/tasks/components/AddTaskButton/AddTaskButton.module.css'

export function AddTaskButton() {
  return (
    <button type="button" className={styles.button} aria-label="Add task">
      <PlusIcon />
    </button>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2.5V13.5M2.5 8H13.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

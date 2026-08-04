import styles from '@/features/tasks/components/DueDate/DueDate.module.css'

type DueDateProps = {
  dueDate: string
}

const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

export function DueDate({ dueDate }: DueDateProps) {
  return <span className={styles.dueDate}>{formatter.format(new Date(dueDate))}</span>
}

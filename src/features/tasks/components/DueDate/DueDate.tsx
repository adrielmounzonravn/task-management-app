import { ClockIcon } from '@/shared/ui/icons'
import { formatDueDate } from '@/features/tasks/domain/dueDate'
import styles from '@/features/tasks/components/DueDate/DueDate.module.css'

type DueDateProps = {
  dueDate: string
}

export function DueDate({ dueDate }: DueDateProps) {
  const { label, tone } = formatDueDate(dueDate)

  return (
    <span className={`${styles.dueDate} ${styles[tone]}`} data-testid="due-date">
      <ClockIcon />
      {label}
    </span>
  )
}

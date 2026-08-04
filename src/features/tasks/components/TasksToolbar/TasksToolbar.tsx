import { ViewToggle } from '@/shared/ui/ViewToggle/ViewToggle'
import { AddTaskButton } from '@/features/tasks/components/AddTaskButton/AddTaskButton'
import styles from '@/features/tasks/components/TasksToolbar/TasksToolbar.module.css'

export function TasksToolbar() {
  return (
    <div className={styles.toolbar}>
      <ViewToggle />
      <AddTaskButton />
    </div>
  )
}

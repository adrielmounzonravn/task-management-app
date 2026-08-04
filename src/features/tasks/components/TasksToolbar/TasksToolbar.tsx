import { ViewToggle } from '@/shared/ui/ViewToggle/ViewToggle'
import { AddTaskButton } from '@/features/tasks/components/AddTaskButton/AddTaskButton'
import { useTaskView } from '@/features/tasks/useTaskView'
import styles from '@/features/tasks/components/TasksToolbar/TasksToolbar.module.css'

export function TasksToolbar() {
  const { view, setView } = useTaskView()

  return (
    <div className={styles.toolbar}>
      <ViewToggle value={view} onChange={setView} />
      <AddTaskButton />
    </div>
  )
}

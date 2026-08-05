import { useCallback, useState } from 'react'
import { ViewToggle } from '@/shared/ui/ViewToggle/ViewToggle'
import { AddTaskButton } from '@/features/tasks/components/AddTaskButton/AddTaskButton'
import { TaskFormModal } from '@/features/tasks/components/TaskFormModal/TaskFormModal'
import { usePrefetchUsers } from '@/features/tasks/api/useUsers'
import { useTaskView } from '@/features/tasks/useTaskView'
import styles from '@/features/tasks/components/TasksToolbar/TasksToolbar.module.css'

export function TasksToolbar() {
  const { view, setView } = useTaskView()
  const [isCreateTaskOpen, setCreateTaskOpen] = useState(false)
  const closeCreateTaskModal = useCallback(() => setCreateTaskOpen(false), [])
  const prefetchUsers = usePrefetchUsers()

  return (
    <div className={styles.toolbar}>
      <ViewToggle value={view} onChange={setView} />
      <AddTaskButton onClick={() => setCreateTaskOpen(true)} onMouseEnter={prefetchUsers} />
      <TaskFormModal open={isCreateTaskOpen} onClose={closeCreateTaskModal} />
    </div>
  )
}

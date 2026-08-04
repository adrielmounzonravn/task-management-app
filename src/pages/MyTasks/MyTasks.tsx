import { Suspense } from 'react'
import { useProfile } from '@/features/profile/api/useProfile'
import { KanbanBoard } from '@/features/tasks/components/KanbanBoard/KanbanBoard'
import { TasksToolbar } from '@/features/tasks/components/TasksToolbar/TasksToolbar'
import { Spinner } from '@/shared/ui/Spinner/Spinner'
import styles from './MyTasks.module.css'

export function MyTasks() {
  return (
    <>
      <TasksToolbar />
      <Suspense
        fallback={
          <div className={styles.loading}>
            <Spinner />
          </div>
        }
      >
        <MyTasksBoard />
      </Suspense>
    </>
  )
}

function MyTasksBoard() {
  const profile = useProfile()

  return <KanbanBoard assigneeId={profile.id} />
}

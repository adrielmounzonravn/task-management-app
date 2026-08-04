import { Suspense } from 'react'
import { useProfile } from '@/features/profile/api/useProfile'
import { TasksToolbar } from '@/features/tasks/components/TasksToolbar/TasksToolbar'
import { TasksView } from '@/features/tasks/components/TasksView/TasksView'
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

  return <TasksView assigneeId={profile.id} />
}

import { Suspense } from 'react'
import { useProfile } from '@/features/profile/api/useProfile'
import { TaskList } from '@/features/tasks/components/TaskList/TaskList'
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

  return <TaskList assigneeId={profile.id} />
}

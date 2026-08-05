import { Suspense } from 'react'
import { KanbanBoard } from '@/features/tasks/components/KanbanBoard/KanbanBoard'
import { TaskList } from '@/features/tasks/components/TaskList/TaskList'
import { useTaskView } from '@/features/tasks/useTaskView'
import { Spinner } from '@/shared/ui/Spinner/Spinner'
import styles from '@/features/tasks/components/TasksView/TasksView.module.css'

type TasksViewProps = {
  assigneeId?: string
}

export function TasksView({ assigneeId }: TasksViewProps) {
  const { view } = useTaskView()

  return (
    <Suspense
      fallback={
        <div className={styles.loading}>
          <Spinner />
        </div>
      }
    >
      {view === 'list' ? (
        <TaskList assigneeId={assigneeId} />
      ) : (
        <KanbanBoard assigneeId={assigneeId} />
      )}
    </Suspense>
  )
}

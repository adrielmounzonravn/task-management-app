import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useRetryTasks } from '@/features/tasks/api/useRetryTasks'
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
  const retryTasks = useRetryTasks()

  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <div className={styles.error}>
          <span>Something went wrong loading tasks.</span>
          <button
            type="button"
            className={styles.retry}
            onClick={async () => {
              await retryTasks()
              resetErrorBoundary()
            }}
          >
            Retry
          </button>
        </div>
      )}
    >
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
    </ErrorBoundary>
  )
}

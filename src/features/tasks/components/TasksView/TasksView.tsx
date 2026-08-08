import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { useRetryTasks } from '@/features/tasks/api/useRetryTasks'
import { KanbanBoard } from '@/features/tasks/components/KanbanBoard/KanbanBoard'
import { TaskList } from '@/features/tasks/components/TaskList/TaskList'
import { useTaskView } from '@/features/tasks/useTaskView'
import { Spinner } from '@/shared/ui/Spinner/Spinner'
import styles from '@/features/tasks/components/TasksView/TasksView.module.css'

function isUnauthenticatedError(error: unknown) {
  return (
    CombinedGraphQLErrors.is(error) &&
    error.errors.some((graphQLError) => graphQLError.extensions?.code === 'UNAUTHENTICATED')
  )
}

type TasksViewProps = {
  assigneeId?: string
}

export function TasksView({ assigneeId }: TasksViewProps) {
  const { view } = useTaskView()
  const retryTasks = useRetryTasks()

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className={styles.error}>
          <span>
            {isUnauthenticatedError(error)
              ? 'Your session token is missing or invalid.'
              : 'Something went wrong loading tasks.'}
          </span>
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

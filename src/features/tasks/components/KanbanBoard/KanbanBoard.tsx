import { TaskColumn } from '@/features/tasks/components/TaskColumn/TaskColumn'
import { STATUS_COLUMNS, getTasksByStatus } from '@/features/tasks/domain/status'
import { useTasks } from '@/features/tasks/api/useTasks'
import { useTaskFilters } from '@/features/tasks/useTaskFilters'
import { useTaskSearch } from '@/features/tasks/useTaskSearch'
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState'
import { Toast, useToast } from '@/shared/ui/Toast/Toast'
import styles from '@/features/tasks/components/KanbanBoard/KanbanBoard.module.css'

type KanbanBoardProps = {
  assigneeId?: string
}

export function KanbanBoard({ assigneeId }: KanbanBoardProps) {
  const search = useTaskSearch()
  const { status, tags, pointEstimate } = useTaskFilters()
  const tasks = useTasks({
    name: search || undefined,
    assigneeId,
    status,
    tags: tags.length > 0 ? tags : undefined,
    pointEstimate,
  })
  const { toast, showToast, hideToast } = useToast()

  return (
    <>
      {tasks.length === 0 ? (
        <EmptyState message="No results found." />
      ) : (
        <div className={styles.board}>
          {STATUS_COLUMNS.map(({ status, label }) => (
            <TaskColumn
              key={status}
              label={label}
              tasks={getTasksByStatus(tasks, status)}
              showToast={showToast}
            />
          ))}
        </div>
      )}
      <Toast {...toast} onDismiss={hideToast} />
    </>
  )
}

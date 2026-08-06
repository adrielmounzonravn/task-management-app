import { TaskListGroup } from '@/features/tasks/components/TaskListGroup/TaskListGroup'
import { STATUS_COLUMNS, getTasksByStatus } from '@/features/tasks/domain/status'
import { useTasks } from '@/features/tasks/api/useTasks'
import { useTaskSearch } from '@/features/tasks/useTaskSearch'
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState'
import styles from '@/features/tasks/components/TaskList/TaskList.module.css'

type TaskListProps = {
  assigneeId?: string
}

export function TaskList({ assigneeId }: TaskListProps) {
  const search = useTaskSearch()
  const tasks = useTasks({ name: search || undefined, assigneeId })

  if (tasks.length === 0) {
    return <EmptyState message="No results found." />
  }

  return (
    <div role="table" className={styles.list}>
      <div role="row" className={styles.header}>
        <span role="columnheader">Task Name</span>
        <span role="columnheader">Task Tags</span>
        <span role="columnheader">Estimate</span>
        <span role="columnheader">Task Assign Name</span>
        <span role="columnheader">Due Date</span>
      </div>
      {STATUS_COLUMNS.map(({ status, label }) => (
        <TaskListGroup key={status} label={label} tasks={getTasksByStatus(tasks, status)} />
      ))}
    </div>
  )
}

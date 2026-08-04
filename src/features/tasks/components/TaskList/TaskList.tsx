import { TaskListGroup } from '@/features/tasks/components/TaskListGroup/TaskListGroup'
import {
  STATUS_COLUMNS,
  getTasksByAssignee,
  getTasksBySearch,
  getTasksByStatus,
} from '@/features/tasks/domain/status'
import { tasksFixture } from '@/features/tasks/fixtures/tasks'
import { useTaskSearch } from '@/features/tasks/useTaskSearch'
import styles from '@/features/tasks/components/TaskList/TaskList.module.css'

type TaskListProps = {
  assigneeId?: string
}

export function TaskList({ assigneeId }: TaskListProps) {
  const search = useTaskSearch()
  const tasksByAssignee = assigneeId ? getTasksByAssignee(tasksFixture, assigneeId) : tasksFixture
  const tasks = getTasksBySearch(tasksByAssignee, search)

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

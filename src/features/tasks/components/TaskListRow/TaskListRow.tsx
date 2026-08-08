import { useCallback, useState } from 'react'
import type { Task } from '@/features/tasks/fixtures/tasks'
import { TaskLabel } from '@/features/tasks/components/TaskLabel/TaskLabel'
import { DueDate } from '@/features/tasks/components/DueDate/DueDate'
import { TaskFormModal } from '@/features/tasks/components/TaskFormModal/TaskFormModal'
import { formatDueDate } from '@/features/tasks/domain/dueDate'
import { POINT_ESTIMATE_LABELS } from '@/features/tasks/domain/pointEstimate'
import { useDeleteTask } from '@/features/tasks/api/useDeleteTask'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { ConfirmModal } from '@/shared/ui/ConfirmModal/ConfirmModal'
import { TaskOptionsIcon, EditIcon, DeleteIcon } from '@/shared/ui/icons'
import styles from '@/features/tasks/components/TaskListRow/TaskListRow.module.css'

type TaskListRowProps = {
  task: Task
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function TaskListRow({ task, showToast }: TaskListRowProps) {
  const { tone } = formatDueDate(task.dueDate)
  const { deleteTask, loading: deleting } = useDeleteTask()
  const [isEditOpen, setEditOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const closeEditModal = useCallback(() => setEditOpen(false), [])
  const closeDeleteModal = useCallback(() => setDeleteOpen(false), [])

  async function handleConfirmDelete() {
    try {
      await deleteTask(task.id)
      closeDeleteModal()
      showToast('Task deleted', 'success')
    } catch {
      showToast('Failed to delete task', 'error')
    }
  }

  return (
    <div role="row" className={`${styles.row} ${styles[tone]}`}>
      <span role="cell" className={styles.actions}>
        <Dropdown>
          <Dropdown.Trigger className={styles.options} aria-label="Task options">
            <TaskOptionsIcon />
          </Dropdown.Trigger>
          <Dropdown.Panel>
            {(close) => (
              <>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => {
                    close()
                    setEditOpen(true)
                  }}
                >
                  <EditIcon />
                  Edit
                </button>
                <button
                  type="button"
                  className={`${styles.menuItem} ${styles.menuItemDanger}`}
                  onClick={() => {
                    close()
                    setDeleteOpen(true)
                  }}
                >
                  <DeleteIcon />
                  Delete
                </button>
              </>
            )}
          </Dropdown.Panel>
        </Dropdown>
      </span>
      <span role="cell" className={styles.name} title={task.name}>
        {task.name}
      </span>
      <div role="cell" className={styles.tags}>
        {task.tags.map((tag) => (
          <TaskLabel key={tag} tag={tag} />
        ))}
      </div>
      <span role="cell" className={styles.estimate}>
        {POINT_ESTIMATE_LABELS[task.pointEstimate]}
      </span>
      <span role="cell" className={styles.assignee}>
        {task.assignee?.fullName ?? 'Unassigned'}
      </span>
      <span role="cell">
        <DueDate dueDate={task.dueDate} />
      </span>
      <TaskFormModal task={task} open={isEditOpen} onClose={closeEditModal} />
      <ConfirmModal
        open={isDeleteOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete task"
        description={`Are you sure you want to delete "${task.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  )
}

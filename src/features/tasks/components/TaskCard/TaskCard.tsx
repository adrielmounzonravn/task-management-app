import { useCallback, useState } from 'react'
import type { Task } from '@/features/tasks/fixtures/tasks'
import { TaskFormModal } from '@/features/tasks/components/TaskFormModal/TaskFormModal'
import { TaskLabel } from '@/features/tasks/components/TaskLabel/TaskLabel'
import { DueDate } from '@/features/tasks/components/DueDate/DueDate'
import { ProfilePhoto } from '@/shared/ui/ProfilePhoto/ProfilePhoto'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { TaskOptionsIcon, EditIcon, DeleteIcon } from '@/shared/ui/icons'
import { ConfirmModal } from '@/shared/ui/ConfirmModal/ConfirmModal'
import { POINT_ESTIMATE_LABELS } from '@/features/tasks/domain/pointEstimate'
import { useDeleteTask } from '@/features/tasks/api/useDeleteTask'
import styles from '@/features/tasks/components/TaskCard/TaskCard.module.css'

type TaskCardProps = {
  task: Task
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function TaskCard({ task, showToast }: TaskCardProps) {
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
    <div className={styles.card} data-testid="task-card">
      <div className={styles.header}>
        <span className={styles.name} data-testid="task-card-name" title={task.name}>
          {task.name}
        </span>
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
      </div>
      <div className={styles.meta}>
        <span className={styles.points}>{POINT_ESTIMATE_LABELS[task.pointEstimate]}</span>
        <DueDate dueDate={task.dueDate} />
      </div>
      <div className={styles.tags}>
        {task.tags.map((tag) => (
          <TaskLabel key={tag} tag={tag} />
        ))}
      </div>
      <div className={styles.footer}>
        <ProfilePhoto size="sm" />
        <span className={styles.assignee}>{task.assignee?.fullName ?? 'Unassigned'}</span>
      </div>
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

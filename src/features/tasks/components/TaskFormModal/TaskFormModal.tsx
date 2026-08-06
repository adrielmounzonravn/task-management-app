import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateTask } from '@/features/tasks/api/useCreateTask'
import { useUpdateTask } from '@/features/tasks/api/useUpdateTask'
import { AssigneeField } from '@/features/tasks/components/TaskFormModal/AssigneeField'
import { TaskLabel } from '@/features/tasks/components/TaskLabel/TaskLabel'
import { POINT_ESTIMATE_LABELS } from '@/features/tasks/domain/pointEstimate'
import { TAG_LABELS } from '@/features/tasks/domain/tags'
import type { Task } from '@/features/tasks/fixtures/tasks'
import { DatePicker } from '@/shared/ui/DatePicker/DatePicker'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { Modal } from '@/shared/ui/Modal/Modal'
import { EstimateIcon, LabelIcon } from '@/shared/ui/icons'
import type { PointEstimate, TaskTag } from '@/gql/graphql'
import styles from '@/features/tasks/components/TaskFormModal/TaskFormModal.module.css'

const POINT_ESTIMATE_OPTIONS = Object.keys(POINT_ESTIMATE_LABELS) as PointEstimate[]
const TAG_OPTIONS = Object.keys(TAG_LABELS) as TaskTag[]

type FormValues = {
  name: string
  pointEstimate: PointEstimate | undefined
  tags: TaskTag[]
  assigneeId: string | undefined
  dueDate: string
}

function defaultDueDate(task: Task | undefined) {
  return task ? task.dueDate.slice(0, 10) : new Date().toISOString().slice(0, 10)
}

type TaskFormModalProps = {
  open: boolean
  onClose: () => void
  task?: Task
}

export function TaskFormModal({ open, onClose, task }: TaskFormModalProps) {
  const { createTask, loading: creating } = useCreateTask()
  const { updateTask, loading: updating } = useUpdateTask()
  const loading = creating || updating
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { register, handleSubmit, watch, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      name: task?.name ?? '',
      pointEstimate: task?.pointEstimate,
      tags: task?.tags ?? [],
      assigneeId: task?.assignee?.id,
      dueDate: defaultDueDate(task),
    },
  })

  const name = watch('name')
  const pointEstimate = watch('pointEstimate')
  const tags = watch('tags')
  const assigneeId = watch('assigneeId')
  const dueDate = watch('dueDate')

  function toggleTag(tag: TaskTag) {
    setValue('tags', tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag])
  }

  function handleClose() {
    reset()
    setSubmitError(null)
    onClose()
  }

  async function onSubmit(values: FormValues) {
    setSubmitError(null)
    try {
      if (task) {
        await updateTask({
          id: task.id,
          name: values.name,
          pointEstimate: values.pointEstimate,
          tags: values.tags,
          assigneeId: values.assigneeId,
          dueDate: new Date(values.dueDate).toISOString(),
        })
      } else {
        await createTask({
          name: values.name,
          pointEstimate: values.pointEstimate ?? 'ONE',
          status: 'BACKLOG',
          tags: values.tags,
          assigneeId: values.assigneeId,
          dueDate: new Date(values.dueDate).toISOString(),
        })
      }
      handleClose()
    } catch {
      setSubmitError(
        task
          ? 'Something went wrong updating this task.'
          : 'Something went wrong creating this task.',
      )
    }
  }

  return (
    <Modal open={open} onClose={handleClose} labelledBy="task-modal-title">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          id="task-modal-title"
          className={styles.title}
          placeholder="Task Title"
          autoFocus
          {...register('name', { required: true })}
        />

        <div className={styles.fields}>
          <Dropdown>
            <Dropdown.Trigger>
              <EstimateIcon />
              {pointEstimate ? POINT_ESTIMATE_LABELS[pointEstimate] : 'Estimate'}
            </Dropdown.Trigger>
            <Dropdown.Panel>
              {(close) =>
                POINT_ESTIMATE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={styles.option}
                    onClick={() => {
                      setValue('pointEstimate', option)
                      close()
                    }}
                  >
                    {POINT_ESTIMATE_LABELS[option]}
                  </button>
                ))
              }
            </Dropdown.Panel>
          </Dropdown>

          <AssigneeField
            assigneeId={assigneeId}
            onChange={(value) => setValue('assigneeId', value)}
          />

          <Dropdown>
            <Dropdown.Trigger>
              <LabelIcon />
              {tags.length === 0 ? (
                'Label'
              ) : (
                <span className={styles.tags}>
                  {tags.map((tag) => (
                    <TaskLabel key={tag} tag={tag} />
                  ))}
                </span>
              )}
            </Dropdown.Trigger>
            <Dropdown.Panel>
              {(close) =>
                TAG_OPTIONS.map((tag) => (
                  <label
                    key={tag}
                    className={styles.checkboxOption}
                    onClick={() => {
                      toggleTag(tag)
                      close()
                    }}
                  >
                    <input type="checkbox" checked={tags.includes(tag)} readOnly />
                    {TAG_LABELS[tag]}
                  </label>
                ))
              }
            </Dropdown.Panel>
          </Dropdown>

          <DatePicker value={dueDate} onChange={(value) => setValue('dueDate', value)} />
        </div>

        {submitError && <p className={styles.formError}>{submitError}</p>}

        <div className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className={styles.submit} disabled={!name.trim() || loading}>
            {task ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

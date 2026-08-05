import { useUsers } from '@/features/tasks/api/useUsers'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { Spinner } from '@/shared/ui/Spinner/Spinner'
import { AssigneeIcon } from '@/shared/ui/icons'
import styles from '@/features/tasks/components/TaskFormModal/TaskFormModal.module.css'

type AssigneeFieldProps = {
  assigneeId: string | undefined
  onChange: (assigneeId: string) => void
}

export function AssigneeField({ assigneeId, onChange }: AssigneeFieldProps) {
  const { users, loading } = useUsers()

  if (loading || !users) {
    return <Spinner />
  }

  const assignee = users.find((user) => user.id === assigneeId)

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <AssigneeIcon />
        {assignee?.fullName ?? 'Assignee'}
      </Dropdown.Trigger>
      <Dropdown.Panel>
        {(close) =>
          users.map((user) => (
            <button
              key={user.id}
              type="button"
              className={styles.option}
              onClick={() => {
                onChange(user.id)
                close()
              }}
            >
              {user.fullName}
            </button>
          ))
        }
      </Dropdown.Panel>
    </Dropdown>
  )
}

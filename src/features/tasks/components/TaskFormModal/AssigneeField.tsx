import { useUsers } from '@/features/tasks/api/useUsers'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { Spinner } from '@/shared/ui/Spinner/Spinner'
import { AssigneeIcon } from '@/shared/ui/icons'

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
            <Dropdown.Option
              key={user.id}
              onSelect={() => {
                onChange(user.id)
                close()
              }}
            >
              {user.fullName}
            </Dropdown.Option>
          ))
        }
      </Dropdown.Panel>
    </Dropdown>
  )
}

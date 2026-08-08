import { TaskLabel } from '@/features/tasks/components/TaskLabel/TaskLabel'
import { STATUS_COLUMNS } from '@/features/tasks/domain/status'
import { TAG_LABELS } from '@/features/tasks/domain/tags'
import { POINT_ESTIMATE_LABELS } from '@/features/tasks/domain/pointEstimate'
import { useTaskFilters } from '@/features/tasks/useTaskFilters'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { BoardIcon, EstimateIcon, LabelIcon } from '@/shared/ui/icons'
import type { PointEstimate, TaskTag } from '@/gql/graphql'
import styles from '@/features/tasks/components/TaskFilters/TaskFilters.module.css'

const POINT_ESTIMATE_OPTIONS = Object.keys(POINT_ESTIMATE_LABELS) as PointEstimate[]
const TAG_OPTIONS = Object.keys(TAG_LABELS) as TaskTag[]

export function TaskFilters() {
  const { status, tags, pointEstimate, setStatus, setPointEstimate, toggleTag } = useTaskFilters()

  return (
    <div className={styles.filters}>
      <Dropdown>
        <Dropdown.Trigger aria-label="Filter by status">
          <BoardIcon />
          {STATUS_COLUMNS.find((column) => column.status === status)?.label ?? 'Status'}
        </Dropdown.Trigger>
        <Dropdown.Panel>
          {(close) => (
            <>
              <Dropdown.Option
                onSelect={() => {
                  setStatus(undefined)
                  close()
                }}
              >
                All statuses
              </Dropdown.Option>
              {STATUS_COLUMNS.map((option) => (
                <Dropdown.Option
                  key={option.status}
                  onSelect={() => {
                    setStatus(option.status)
                    close()
                  }}
                >
                  {option.label}
                </Dropdown.Option>
              ))}
            </>
          )}
        </Dropdown.Panel>
      </Dropdown>

      <Dropdown>
        <Dropdown.Trigger aria-label="Filter by tags">
          <LabelIcon />
          {tags.length === 0 ? (
            'Tags'
          ) : (
            <span className={styles.tags}>
              {tags.map((tag) => (
                <TaskLabel key={tag} tag={tag} />
              ))}
            </span>
          )}
        </Dropdown.Trigger>
        <Dropdown.Panel>
          {() =>
            TAG_OPTIONS.map((tag) => (
              <Dropdown.CheckboxOption
                key={tag}
                checked={tags.includes(tag)}
                onSelect={() => toggleTag(tag)}
              >
                {TAG_LABELS[tag]}
              </Dropdown.CheckboxOption>
            ))
          }
        </Dropdown.Panel>
      </Dropdown>

      <Dropdown>
        <Dropdown.Trigger aria-label="Filter by estimate">
          <EstimateIcon />
          {pointEstimate ? POINT_ESTIMATE_LABELS[pointEstimate] : 'Estimate'}
        </Dropdown.Trigger>
        <Dropdown.Panel>
          {(close) => (
            <>
              <Dropdown.Option
                onSelect={() => {
                  setPointEstimate(undefined)
                  close()
                }}
              >
                All estimates
              </Dropdown.Option>
              {POINT_ESTIMATE_OPTIONS.map((option) => (
                <Dropdown.Option
                  key={option}
                  onSelect={() => {
                    setPointEstimate(option)
                    close()
                  }}
                >
                  {POINT_ESTIMATE_LABELS[option]}
                </Dropdown.Option>
              ))}
            </>
          )}
        </Dropdown.Panel>
      </Dropdown>
    </div>
  )
}

import type { TaskTag } from '@/gql/graphql'
import { TAG_LABELS, TAG_TONES } from '@/features/tasks/domain/tags'
import styles from '@/features/tasks/components/TaskLabel/TaskLabel.module.css'

type TaskLabelProps = {
  tag: TaskTag
}

export function TaskLabel({ tag }: TaskLabelProps) {
  return <span className={`${styles.label} ${styles[TAG_TONES[tag]]}`}>{TAG_LABELS[tag]}</span>
}

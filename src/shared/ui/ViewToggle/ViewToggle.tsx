import { BoardIcon, ListIcon } from '@/shared/ui/icons'
import styles from '@/shared/ui/ViewToggle/ViewToggle.module.css'

type ViewToggleProps = {
  value: 'list' | 'board'
  onChange: (value: 'list' | 'board') => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className={styles.toggle}>
      <label className={styles.option}>
        <input
          type="radio"
          name="view"
          value="list"
          checked={value === 'list'}
          onChange={() => onChange('list')}
          className={styles.input}
        />
        <span className={styles.icon}>
          <ListIcon />
        </span>
      </label>
      <label className={styles.option}>
        <input
          type="radio"
          name="view"
          value="board"
          checked={value === 'board'}
          onChange={() => onChange('board')}
          className={styles.input}
        />
        <span className={styles.icon}>
          <BoardIcon />
        </span>
      </label>
    </div>
  )
}

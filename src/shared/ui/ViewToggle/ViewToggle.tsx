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

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2.25 4.5H15.75M2.25 9H15.75M2.25 13.5H15.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BoardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2.25" y="2.25" width="5.5" height="5.5" rx="1" fill="currentColor" />
      <rect x="10.25" y="2.25" width="5.5" height="5.5" rx="1" fill="currentColor" />
      <rect x="2.25" y="10.25" width="5.5" height="5.5" rx="1" fill="currentColor" />
      <rect x="10.25" y="10.25" width="5.5" height="5.5" rx="1" fill="currentColor" />
    </svg>
  )
}

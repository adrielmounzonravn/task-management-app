import { NavLink } from 'react-router'
import { NotificationButton } from '@/shared/ui/NotificationButton/NotificationButton'
import { ProfilePhoto } from '@/shared/ui/ProfilePhoto/ProfilePhoto'
import styles from './Topbar.module.css'

type TopbarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
}

export function Topbar({ searchValue, onSearchChange }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <input
        className={styles.search}
        type="search"
        placeholder="Search"
        value={searchValue}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
      />
      <div className={styles.actions}>
        <NotificationButton />
        <NavLink to="/settings" aria-label="Settings">
          <ProfilePhoto />
        </NavLink>
      </div>
    </header>
  )
}

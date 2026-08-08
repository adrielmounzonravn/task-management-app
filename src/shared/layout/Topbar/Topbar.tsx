import type { ReactNode } from 'react'
import { NavLink } from 'react-router'
import { NotificationButton } from '@/shared/ui/NotificationButton/NotificationButton'
import { ProfilePhoto } from '@/shared/ui/ProfilePhoto/ProfilePhoto'
import { SearchIcon } from '@/shared/ui/icons'
import styles from './Topbar.module.css'

type TopbarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  filters?: ReactNode
}

export function Topbar({ searchValue, onSearchChange, filters }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>
          <SearchIcon />
        </span>
        <input
          className={styles.search}
          type="search"
          placeholder="Search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
        />
      </div>
      {filters}
      <div className={styles.actions}>
        <NotificationButton />
        <NavLink to="/settings" aria-label="Settings">
          <ProfilePhoto />
        </NavLink>
      </div>
    </header>
  )
}

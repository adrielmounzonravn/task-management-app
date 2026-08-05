import { NavLink, useSearchParams } from 'react-router'
import { BoardIcon, ListIcon, RavnLogoIcon } from '@/shared/ui/icons'
import styles from './Sidebar.module.css'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return isActive ? styles.navLinkActive : styles.navLink
}

export function Sidebar() {
  const [searchParams] = useSearchParams()
  const search = searchParams.toString()

  return (
    <aside className={styles.sidebar}>
      <span className={styles.logo}>
        <RavnLogoIcon />
      </span>
      <NavLink to={{ pathname: '/', search }} end className={navLinkClassName}>
        <BoardIcon />
        Dashboard
      </NavLink>
      <NavLink to={{ pathname: '/my-tasks', search }} className={navLinkClassName}>
        <ListIcon />
        My Tasks
      </NavLink>
    </aside>
  )
}

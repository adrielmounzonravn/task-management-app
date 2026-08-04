import { NavLink, useSearchParams } from 'react-router'
import styles from './Sidebar.module.css'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return isActive ? styles.navLinkActive : styles.navLink
}

export function Sidebar() {
  const [searchParams] = useSearchParams()
  const search = searchParams.toString()

  return (
    <aside className={styles.sidebar}>
      <NavLink to={{ pathname: '/', search }} end className={navLinkClassName}>
        Dashboard
      </NavLink>
      <NavLink to={{ pathname: '/my-tasks', search }} className={navLinkClassName}>
        My Tasks
      </NavLink>
    </aside>
  )
}

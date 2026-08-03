import { NavLink } from 'react-router'
import styles from './Sidebar.module.css'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return isActive ? styles.navLinkActive : styles.navLink
}

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <NavLink to="/" end className={navLinkClassName}>
        Dashboard
      </NavLink>
      <NavLink to="/my-tasks" className={navLinkClassName}>
        My Tasks
      </NavLink>
    </aside>
  )
}

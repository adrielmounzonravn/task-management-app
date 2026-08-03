import { NavLink } from 'react-router'
import styles from './Sidebar.module.css'

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/my-tasks">My Tasks</NavLink>
    </aside>
  )
}

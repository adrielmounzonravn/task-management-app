import { NavLink } from 'react-router'

export function Sidebar() {
  return (
    <aside>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/my-tasks">My Tasks</NavLink>
    </aside>
  )
}

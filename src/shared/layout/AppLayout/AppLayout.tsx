import { NavLink, Outlet } from 'react-router'

export function AppLayout() {
  return (
    <div>
      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/my-tasks">My Task</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

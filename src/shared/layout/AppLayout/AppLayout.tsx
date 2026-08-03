import { Outlet } from 'react-router'
import { Sidebar } from '@/shared/layout/Sidebar/Sidebar'
import { Topbar } from '@/shared/layout/Topbar/Topbar'

export function AppLayout() {
  return (
    <div>
      <Sidebar />
      <Topbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

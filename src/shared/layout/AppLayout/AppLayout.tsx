import { Outlet } from 'react-router'
import { Sidebar } from '@/shared/layout/Sidebar/Sidebar'
import { Topbar } from '@/shared/layout/Topbar/Topbar'
import styles from './AppLayout.module.css'

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <Topbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

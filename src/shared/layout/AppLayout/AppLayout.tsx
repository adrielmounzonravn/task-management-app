import { Outlet } from 'react-router'
import { Sidebar } from '@/shared/layout/Sidebar/Sidebar'
import { Topbar } from '@/shared/layout/Topbar/Topbar'
import styles from './AppLayout.module.css'

type AppLayoutProps = {
  searchValue: string
  onSearchChange: (value: string) => void
}

export function AppLayout({ searchValue, onSearchChange }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <Topbar searchValue={searchValue} onSearchChange={onSearchChange} />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

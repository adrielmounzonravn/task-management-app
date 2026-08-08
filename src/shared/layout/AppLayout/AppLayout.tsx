import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { Sidebar } from '@/shared/layout/Sidebar/Sidebar'
import { Topbar } from '@/shared/layout/Topbar/Topbar'
import styles from './AppLayout.module.css'

type AppLayoutProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  filters?: ReactNode
}

export function AppLayout({ searchValue, onSearchChange, filters }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <Topbar searchValue={searchValue} onSearchChange={onSearchChange} filters={filters} />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

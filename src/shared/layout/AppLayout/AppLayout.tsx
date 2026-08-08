import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { Sidebar } from '@/shared/layout/Sidebar/Sidebar'
import { Topbar } from '@/shared/layout/Topbar/Topbar'
import styles from './AppLayout.module.css'

type AppLayoutProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  filters?: ReactNode
  profilePhoto?: ReactNode
}

export function AppLayout({ searchValue, onSearchChange, filters, profilePhoto }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <Topbar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        filters={filters}
        profilePhoto={profilePhoto}
      />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

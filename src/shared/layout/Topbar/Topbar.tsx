import { NotificationButton } from '@/shared/ui/NotificationButton/NotificationButton'
import { ProfilePhoto } from '@/shared/ui/ProfilePhoto/ProfilePhoto'
import styles from './Topbar.module.css'

export function Topbar() {
  return (
    <header className={styles.topbar}>
      <input className={styles.search} type="search" placeholder="Search" />
      <div className={styles.actions}>
        <NotificationButton />
        <ProfilePhoto />
      </div>
    </header>
  )
}

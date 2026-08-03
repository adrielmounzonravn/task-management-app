import { NotificationButton } from '@/shared/ui/NotificationButton/NotificationButton'
import { ProfilePhoto } from '@/shared/ui/ProfilePhoto/ProfilePhoto'
import styles from './Topbar.module.css'

export function Topbar() {
  return (
    <header className={styles.topbar}>
      <div />
      <NotificationButton />
      <ProfilePhoto />
    </header>
  )
}

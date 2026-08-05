import { NotificationIcon } from '@/shared/ui/icons'
import styles from '@/shared/ui/NotificationButton/NotificationButton.module.css'

export function NotificationButton() {
  return (
    <button type="button" className={styles.button} aria-label="Notifications">
      <NotificationIcon />
    </button>
  )
}

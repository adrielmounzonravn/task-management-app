import { Link } from 'react-router'
import styles from '@/pages/NotFound/NotFound.module.css'

export function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Page not found</h1>
      <Link className={styles.link} to="/">
        Back to Dashboard
      </Link>
    </div>
  )
}

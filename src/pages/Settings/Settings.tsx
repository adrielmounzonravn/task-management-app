import { Suspense } from 'react'
import { ProfileDetails } from '@/features/profile/components/ProfileDetails/ProfileDetails'
import { Spinner } from '@/shared/ui/Spinner/Spinner'
import styles from './Settings.module.css'

export function Settings() {
  return (
    <Suspense
      fallback={
        <div className={styles.loading}>
          <Spinner />
        </div>
      }
    >
      <ProfileDetails />
    </Suspense>
  )
}

import { useProfile } from '@/features/profile/api/useProfile'
import { getUserTypeLabel } from '@/features/profile/domain/userType'
import { ProfilePhoto } from '@/shared/ui/ProfilePhoto/ProfilePhoto'
import styles from './ProfileDetails.module.css'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

export function ProfileDetails() {
  const profile = useProfile()

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <ProfilePhoto userId={profile.id} photoUrl={profile.avatar} />
        <div>
          <p className={styles.name}>{profile.fullName}</p>
          <p className={styles.email}>{profile.email}</p>
        </div>
      </div>
      <dl className={styles.fields}>
        <div className={styles.field}>
          <dt className={styles.label}>Account type</dt>
          <dd className={styles.value}>{getUserTypeLabel(profile.type)}</dd>
        </div>
        <div className={styles.field}>
          <dt className={styles.label}>Member since</dt>
          <dd className={styles.value}>{dateFormatter.format(new Date(profile.createdAt))}</dd>
        </div>
        <div className={styles.field}>
          <dt className={styles.label}>Last updated</dt>
          <dd className={styles.value}>{dateFormatter.format(new Date(profile.updatedAt))}</dd>
        </div>
        <div className={styles.field}>
          <dt className={styles.label}>User ID</dt>
          <dd className={styles.value}>{profile.id}</dd>
        </div>
      </dl>
    </div>
  )
}

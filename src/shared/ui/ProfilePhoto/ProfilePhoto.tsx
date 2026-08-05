import profilePictureDefault from './profile-picture-default.png'
import styles from './ProfilePhoto.module.css'

type ProfilePhotoProps = {
  size?: 'md' | 'sm'
}

export function ProfilePhoto({ size = 'md' }: ProfilePhotoProps) {
  return (
    <img
      className={`${styles.photo} ${size === 'sm' ? styles.sm : ''}`}
      src={profilePictureDefault}
      alt=""
    />
  )
}

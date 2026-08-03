import profilePictureDefault from './profile-picture-default.png'
import styles from './ProfilePhoto.module.css'

export function ProfilePhoto() {
  return <img className={styles.photo} src={profilePictureDefault} alt="" />
}

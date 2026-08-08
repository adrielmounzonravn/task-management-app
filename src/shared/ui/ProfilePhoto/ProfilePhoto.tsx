import { useState } from 'react'
import profilePictureDefault from './profile-picture-default.png'
import styles from './ProfilePhoto.module.css'

type ProfilePhotoProps = {
  userId?: string
  photoUrl?: string | null
  size?: 'md' | 'sm'
}

function robohashUrl(userId: string) {
  return `https://robohash.org/${encodeURIComponent(userId)}.png?set=set4`
}

function buildCandidates(userId: string | undefined, photoUrl: string | null | undefined) {
  const candidates = [photoUrl, userId ? robohashUrl(userId) : null, profilePictureDefault]
  return [...new Set(candidates.filter((candidate): candidate is string => Boolean(candidate)))]
}

export function ProfilePhoto({ userId, photoUrl, size = 'md' }: ProfilePhotoProps) {
  const candidates = buildCandidates(userId, photoUrl)

  const [index, setIndex] = useState(0)
  const [trackedPrimary, setTrackedPrimary] = useState(candidates[0])

  if (trackedPrimary !== candidates[0]) {
    setTrackedPrimary(candidates[0])
    setIndex(0)
  }

  function handleError() {
    setIndex((current) => Math.min(current + 1, candidates.length - 1))
  }

  return (
    <img
      className={`${styles.photo} ${size === 'sm' ? styles.sm : ''}`}
      src={candidates[index]}
      onError={handleError}
      alt=""
    />
  )
}

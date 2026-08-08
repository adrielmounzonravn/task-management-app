import { useProfile } from '@/features/profile/api/useProfile'
import { ProfilePhoto } from '@/shared/ui/ProfilePhoto/ProfilePhoto'

export function ProfileAvatar() {
  const profile = useProfile()

  return <ProfilePhoto userId={profile.id} photoUrl={profile.avatar} />
}

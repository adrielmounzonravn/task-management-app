import type { TaskTag } from '@/gql/graphql'

export const TAG_LABELS: Record<TaskTag, string> = {
  IOS: 'iOS',
  ANDROID: 'Android',
  REACT: 'React',
  NODE_JS: 'Node.js',
  RAILS: 'Rails',
}

export const TAG_TONES: Record<TaskTag, 'one' | 'two' | 'three' | 'four' | 'five'> = {
  IOS: 'one',
  ANDROID: 'two',
  REACT: 'three',
  NODE_JS: 'four',
  RAILS: 'five',
}

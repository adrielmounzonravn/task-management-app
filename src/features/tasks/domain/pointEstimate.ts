import type { PointEstimate } from '@/gql/graphql'

export const POINT_ESTIMATE_LABELS: Record<PointEstimate, string> = {
  ZERO: '0 Points',
  ONE: '1 Point',
  TWO: '2 Points',
  FOUR: '4 Points',
  EIGHT: '8 Points',
}

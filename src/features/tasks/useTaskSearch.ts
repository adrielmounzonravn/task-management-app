import { useSearchParams } from 'react-router'

export function useTaskSearch() {
  const [searchParams] = useSearchParams()
  return searchParams.get('search') ?? ''
}

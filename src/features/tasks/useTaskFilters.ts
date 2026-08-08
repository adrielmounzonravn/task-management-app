import { useSearchParams } from 'react-router'
import type { PointEstimate, Status, TaskTag } from '@/gql/graphql'

// dueDate is intentionally not filterable here: the server compares it as an exact
// timestamp, which never matches a day-granularity date picker.
//
// ownerId is intentionally not filterable either: FilterTaskInput.ownerId doesn't narrow
// the result set on the live API — passing any existing user id returns every task
// unfiltered, only a non-existent id returns zero results.

function setOrDeleteParam(params: URLSearchParams, key: string, value: string | undefined) {
  if (value) {
    params.set(key, value)
  } else {
    params.delete(key)
  }
}

export function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const status = (searchParams.get('status') as Status | null) ?? undefined
  const pointEstimate = (searchParams.get('pointEstimate') as PointEstimate | null) ?? undefined
  const tags = searchParams.getAll('tags') as TaskTag[]

  function setStatus(next: Status | undefined) {
    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams)
        setOrDeleteParam(nextParams, 'status', next)
        return nextParams
      },
      { replace: true },
    )
  }

  function setPointEstimate(next: PointEstimate | undefined) {
    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams)
        setOrDeleteParam(nextParams, 'pointEstimate', next)
        return nextParams
      },
      { replace: true },
    )
  }

  function toggleTag(tag: TaskTag) {
    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams)
        const currentTags = nextParams.getAll('tags')
        const nextTags = currentTags.includes(tag)
          ? currentTags.filter((current) => current !== tag)
          : [...currentTags, tag]

        nextParams.delete('tags')
        nextTags.forEach((nextTag) => nextParams.append('tags', nextTag))
        return nextParams
      },
      { replace: true },
    )
  }

  return { status, tags, pointEstimate, setStatus, setPointEstimate, toggleTag }
}

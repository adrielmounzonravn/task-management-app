import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

const SEARCH_DEBOUNCE_MS = 300

export function useTaskSearchInput() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [inputValue, setInputValue] = useState(searchParams.get('search') ?? '')

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchParams(
        (previousParams) => {
          const nextParams = new URLSearchParams(previousParams)
          if (inputValue) {
            nextParams.set('search', inputValue)
          } else {
            nextParams.delete('search')
          }
          return nextParams
        },
        { replace: true },
      )
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [inputValue, setSearchParams])

  return { inputValue, setInputValue }
}

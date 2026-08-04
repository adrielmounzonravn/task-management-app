import { useSearchParams } from 'react-router'

export type TaskView = 'board' | 'list'

export function useTaskView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const view: TaskView = searchParams.get('view') === 'list' ? 'list' : 'board'

  function setView(nextView: TaskView) {
    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams)
        nextParams.set('view', nextView)
        return nextParams
      },
      { replace: true },
    )
  }

  return { view, setView }
}

import { BrowserRouter, Route, Routes } from 'react-router'
import { AppLayout } from '@/shared/layout/AppLayout/AppLayout'
import { Dashboard } from '@/pages/Dashboard/Dashboard'
import { MyTasks } from '@/pages/MyTasks/MyTasks'
import { Settings } from '@/pages/Settings/Settings'
import { NotFound } from '@/pages/NotFound/NotFound'
import { useTaskSearchInput } from '@/features/tasks/useTaskSearchInput'

function AppLayoutWithSearch() {
  const { inputValue, setInputValue } = useTaskSearchInput()
  return <AppLayout searchValue={inputValue} onSearchChange={setInputValue} />
}

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayoutWithSearch />}>
          <Route index element={<Dashboard />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

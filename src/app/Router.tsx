import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AppLayout } from '@/shared/layout/AppLayout/AppLayout'
import { ProfilePhoto } from '@/shared/ui/ProfilePhoto/ProfilePhoto'
import { Dashboard } from '@/pages/Dashboard/Dashboard'
import { MyTasks } from '@/pages/MyTasks/MyTasks'
import { Settings } from '@/pages/Settings/Settings'
import { NotFound } from '@/pages/NotFound/NotFound'
import { TaskFilters } from '@/features/tasks/components/TaskFilters/TaskFilters'
import { ProfileAvatar } from '@/features/profile/components/ProfileAvatar/ProfileAvatar'
import { useTaskSearchInput } from '@/features/tasks/useTaskSearchInput'

function AppLayoutWithSearch() {
  const { inputValue, setInputValue } = useTaskSearchInput()
  return (
    <AppLayout
      searchValue={inputValue}
      onSearchChange={setInputValue}
      filters={<TaskFilters />}
      profilePhoto={
        <ErrorBoundary fallback={<ProfilePhoto />}>
          <Suspense fallback={<ProfilePhoto />}>
            <ProfileAvatar />
          </Suspense>
        </ErrorBoundary>
      }
    />
  )
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

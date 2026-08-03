import { BrowserRouter, Route, Routes } from 'react-router'
import { AppLayout } from '@/shared/layout/AppLayout/AppLayout'
import { Dashboard } from '@/pages/Dashboard/Dashboard'
import { Settings } from '@/pages/Settings/Settings'
import { Placeholder } from '@/pages/Placeholder/Placeholder'
import { NotFound } from '@/pages/NotFound/NotFound'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="my-tasks" element={<Placeholder title="My Task" />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

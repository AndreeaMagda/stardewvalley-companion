import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import GardenPage from './pages/GardenPage'
import CropsPage from './pages/CropsPage'
import ResourcesPage from './pages/ResourcesPage'
import TipsPage from './pages/TipsPage'
import BirthdaysPage from './pages/BirthdaysPage'
import CalendarPage from './pages/CalendarPage'
import BundlesPage from './pages/BundlesPage'
import FishPage from './pages/FishPage'
import MiningPage from './pages/MiningPage'
import { useAuth } from './hooks/useAuth'
import { useAppStore } from './store/useAppStore'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'garden',    element: <GardenPage /> },
      { path: 'crops',     element: <CropsPage /> },
      { path: 'bundles',   element: <BundlesPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'birthdays', element: <BirthdaysPage /> },
      { path: 'calendar',  element: <CalendarPage /> },
      { path: 'fish',      element: <FishPage /> },
      { path: 'mining',    element: <MiningPage /> },
      { path: 'tips',      element: <TipsPage /> },
    ],
  },
])

export default function App() {
  const { user, loading } = useAuth()
  const setUserId   = useAppStore((s) => s.setUserId)
  const setUserMeta = useAppStore((s) => s.setUserMeta)

  useEffect(() => {
    setUserId(user?.id ?? null)
    setUserMeta(
      user?.user_metadata?.full_name ?? null,
      user?.user_metadata?.avatar_url ?? null,
    )
  }, [user?.id, setUserId, setUserMeta])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <span className="text-muted text-sm">Loading…</span>
      </div>
    )
  }

  return <RouterProvider router={router} />
}

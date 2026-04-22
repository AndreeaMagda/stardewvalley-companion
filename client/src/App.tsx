import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import Layout from './components/Layout'
import GardenPage from './pages/GardenPage'
import CropsPage from './pages/CropsPage'
import ResourcesPage from './pages/ResourcesPage'
import TipsPage from './pages/TipsPage'
import BirthdaysPage from './pages/BirthdaysPage'
import CalendarPage from './pages/CalendarPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/garden" replace /> },
      { path: 'garden',    element: <GardenPage /> },
      { path: 'crops',     element: <CropsPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'tips',      element: <TipsPage /> },
      { path: 'birthdays', element: <BirthdaysPage /> },
      { path: 'calendar',  element: <CalendarPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}

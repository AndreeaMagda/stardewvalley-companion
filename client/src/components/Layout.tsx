import { useEffect } from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import { useAppStore } from '../store/useAppStore'

export default function Layout() {
  const loadSettings = useAppStore((s) => s.loadSettings)

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-cream">
        <Outlet />
      </main>
    </div>
  )
}

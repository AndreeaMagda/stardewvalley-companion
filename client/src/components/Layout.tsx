import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import DateSheet from './DateSheet'
import { useAppStore } from '../store/useAppStore'

const SEASON_TEXT: Record<string, string> = {
  spring: 'text-spring', summer: 'text-summer', fall: 'text-fall', winter: 'text-winter',
}

export default function Layout() {
  const { loadSettings, userId, currentDay, currentSeason, currentYear } = useAppStore()
  const [showDateSheet, setShowDateSheet] = useState(false)

  useEffect(() => { if (userId) loadSettings() }, [userId, loadSettings])

  return (
    <div className="flex min-h-screen">

      {/* Desktop sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 bg-green flex items-center justify-between px-4 py-3 border-b border-green-light">
          <h1 className="text-sm font-semibold text-cream">🌾 Stardew</h1>
          <button
            onClick={() => setShowDateSheet(true)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-3 py-1.5"
          >
            <span className={`text-xs font-semibold capitalize ${SEASON_TEXT[currentSeason]}`}>
              {currentSeason}
            </span>
            <span className="text-xs text-cream/70">{currentDay} · Y{currentYear}</span>
            <span className="text-cream/50 text-xs">✏️</span>
          </button>
        </header>

        {/* Page content — padded bottom on mobile for bottom nav */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNav />
      </div>

      {/* Mobile date sheet */}
      {showDateSheet && <DateSheet onClose={() => setShowDateSheet(false)} />}
    </div>
  )
}

import { NavLink } from 'react-router'
import { useAppStore } from '../store/useAppStore'
import type { Season } from '@shared'

const NAV = [
  { to: '/garden',    label: 'Garden',    icon: '🌱' },
  { to: '/crops',     label: 'Crops',     icon: '🌾' },
  { to: '/bundles',   label: 'Bundles',   icon: '🏛️' },
  { to: '/resources', label: 'Resources', icon: '🪵' },
  { to: '/birthdays', label: 'Birthdays', icon: '🎁' },
  { to: '/calendar',  label: 'Calendar',  icon: '📅' },
  { to: '/tips',      label: 'Tips',      icon: '💡' },
]

const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_COLOR: Record<Season, string> = {
  spring: 'text-spring',
  summer: 'text-summer',
  fall:   'text-fall',
  winter: 'text-winter',
}

export default function Sidebar() {
  const { currentDay, currentSeason, currentYear, setDay, setSeason, setYear, saveSettings } = useAppStore()

  return (
    <aside className="w-52 min-h-screen flex flex-col bg-green text-cream">

      {/* Brand */}
      <div className="px-6 pt-7 pb-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-green-pale opacity-50 mb-0.5">your</p>
        <h1 className="text-lg font-semibold leading-tight">Stardew<br/>Companion</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-white/15 text-cream font-medium'
                  : 'text-green-pale/70 hover:text-cream hover:bg-white/8'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Date widget */}
      <div className="mx-3 mb-4 bg-white/10 rounded-2xl p-4">
        <p className="text-[10px] uppercase tracking-widest text-green-pale opacity-50 mb-3">In-game date</p>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-pale/70">Season</span>
            <select
              value={currentSeason}
              onChange={(e) => setSeason(e.target.value as Season)}
              className="bg-white/15 text-cream text-xs rounded-lg px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-white/30 capitalize cursor-pointer"
            >
              {SEASONS.map((s) => (
                <option key={s} value={s} className="bg-green capitalize">{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-green-pale/70">Day</span>
            <input
              type="number" min={1} max={28}
              value={currentDay}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-14 text-center bg-white/15 text-cream text-xs rounded-lg px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-green-pale/70">Year</span>
            <input
              type="number" min={1}
              value={currentYear}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-14 text-center bg-white/15 text-cream text-xs rounded-lg px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>
        </div>

        <button
          onClick={() => saveSettings()}
          className="w-full text-xs bg-brown hover:bg-brown-light transition-colors rounded-lg py-1.5 font-medium"
        >
          Save date
        </button>

        <p className={`text-xs font-semibold capitalize mt-2 text-center ${SEASON_COLOR[currentSeason]}`}>
          {currentSeason} {currentDay} · Y{currentYear}
        </p>
      </div>

    </aside>
  )
}

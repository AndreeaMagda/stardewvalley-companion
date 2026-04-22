import { NavLink } from 'react-router'
import { useAppStore } from '../store/useAppStore'
import type { Season } from '@shared'

const NAV_ITEMS = [
  { to: '/garden',    label: 'Garden',    icon: '🌱' },
  { to: '/crops',     label: 'Crops',     icon: '🌾' },
  { to: '/resources', label: 'Resources', icon: '🪵' },
  { to: '/birthdays', label: 'Birthdays', icon: '🎁' },
  { to: '/calendar',  label: 'Calendar',  icon: '📅' },
  { to: '/tips',      label: 'Tips',      icon: '💡' },
]

const SEASON_COLORS: Record<Season, string> = {
  spring: 'text-spring',
  summer: 'text-summer',
  fall:   'text-fall',
  winter: 'text-winter',
}

const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

export default function Sidebar() {
  const { currentDay, currentSeason, currentYear, setDay, setSeason, setYear, saveSettings } = useAppStore()

  const handleSave = () => saveSettings()

  return (
    <aside className="w-56 min-h-screen bg-green text-cream flex flex-col border-r-2 border-brown">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-green-light">
        <h1 className="text-xl font-semibold tracking-wide">Stardew</h1>
        <p className="text-xs text-green-pale mt-0.5 opacity-70">companion</p>
      </div>

      {/* Game date widget */}
      <div className="px-4 py-4 border-b border-green-light bg-green-light/20">
        <p className="text-xs uppercase tracking-widest text-green-pale opacity-60 mb-2">Current Date</p>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">Year</span>
          <input
            type="number"
            min={1}
            value={currentYear}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-12 text-center rounded bg-green-light text-cream text-sm px-1 py-0.5 border border-green-pale/30 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">Day</span>
          <input
            type="number"
            min={1}
            max={28}
            value={currentDay}
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-12 text-center rounded bg-green-light text-cream text-sm px-1 py-0.5 border border-green-pale/30 focus:outline-none"
          />
        </div>
        <select
          value={currentSeason}
          onChange={(e) => setSeason(e.target.value as Season)}
          className="w-full rounded bg-green-light text-cream text-sm px-2 py-1 border border-green-pale/30 focus:outline-none mb-2 capitalize"
        >
          {SEASONS.map((s) => (
            <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <p className={`text-xs font-semibold capitalize ${SEASON_COLORS[currentSeason]}`}>
          {currentSeason} {currentDay}, Year {currentYear}
        </p>
        <button
          onClick={handleSave}
          className="mt-2 w-full text-xs bg-brown hover:bg-brown-light transition-colors rounded px-2 py-1 text-cream"
        >
          Save Date
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-brown text-cream font-medium'
                  : 'text-green-pale hover:bg-green-light/30'
              }`
            }
          >
            <span>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-green-light">
        <p className="text-xs text-green-pale opacity-40">v0.1 · dev-user</p>
      </div>
    </aside>
  )
}

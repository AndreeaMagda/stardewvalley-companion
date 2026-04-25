import { NavLink } from 'react-router'
import {
  Sprout, Wheat, Building2, Package, Gift,
  CalendarDays, Fish, Pickaxe, BookOpen, LogOut,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { Season } from '@shared'
import { supabase } from '../api/supabase'

const NAV = [
  { to: '/garden',    label: 'Garden',    Icon: Sprout     },
  { to: '/crops',     label: 'Crops',     Icon: Wheat      },
  { to: '/bundles',   label: 'Bundles',   Icon: Building2  },
  { to: '/resources', label: 'Resources', Icon: Package    },
  { to: '/birthdays', label: 'Birthdays', Icon: Gift       },
  { to: '/calendar',  label: 'Calendar',  Icon: CalendarDays },
  { to: '/fish',      label: 'Fish',      Icon: Fish       },
  { to: '/mining',    label: 'Mining',    Icon: Pickaxe    },
  { to: '/tips',      label: 'Tips',      Icon: BookOpen   },
]

const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_COLOR: Record<Season, string> = {
  spring: 'text-spring', summer: 'text-summer', fall: 'text-fall', winter: 'text-winter',
}

export default function Sidebar() {
  const { currentDay, currentSeason, currentYear, setDay, setSeason, setYear, saveSettings } = useAppStore()

  return (
    <aside className="w-56 min-h-screen flex flex-col bg-green" style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Brand */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Sprout size={16} className="text-cream" />
          </div>
          <div>
            <p className="text-cream font-semibold text-sm leading-tight">Stardew</p>
            <p className="text-green-pale/50 text-[11px] leading-tight">Companion</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-white/15 text-cream font-medium shadow-sm'
                  : 'text-green-pale/60 hover:text-cream hover:bg-white/8'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-cream' : 'text-green-pale/50'} strokeWidth={isActive ? 2.5 : 1.75} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Date widget */}
      <div className="mx-3 mb-2 rounded-2xl bg-white/8 p-4">
        <p className="text-[10px] uppercase tracking-widest text-green-pale/40 mb-3">In-game date</p>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-pale/60">Season</span>
            <select
              value={currentSeason}
              onChange={(e) => setSeason(e.target.value as Season)}
              className="bg-white/10 text-cream text-xs rounded-lg px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-white/20 capitalize cursor-pointer"
            >
              {SEASONS.map((s) => (
                <option key={s} value={s} className="bg-green capitalize">{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-green-pale/60">Day</span>
            <input
              type="number" min={1} max={28} value={currentDay}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-14 text-center bg-white/10 text-cream text-xs rounded-lg px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-green-pale/60">Year</span>
            <input
              type="number" min={1} value={currentYear}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-14 text-center bg-white/10 text-cream text-xs rounded-lg px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>
        </div>

        <button
          onClick={() => saveSettings()}
          className="w-full text-xs bg-white/10 hover:bg-white/20 transition-colors rounded-lg py-1.5 font-medium text-cream"
        >
          Save date
        </button>

        <p className={`text-xs font-semibold capitalize mt-2 text-center ${SEASON_COLOR[currentSeason]}`}>
          {currentSeason} {currentDay} · Y{currentYear}
        </p>
      </div>

      {/* Sign out */}
      <div className="px-3 mb-4">
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full flex items-center justify-center gap-2 text-xs text-green-pale/40 hover:text-green-pale/70 transition-colors py-2 rounded-xl hover:bg-white/5"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>

    </aside>
  )
}

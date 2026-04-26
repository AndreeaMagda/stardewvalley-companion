import { NavLink } from 'react-router'
import {
  Sprout, Wheat, Building2, Package, Gift,
  CalendarDays, Fish, Pickaxe, BookOpen, LogOut,
  CalendarCheck, Leaf, ChefHat, Heart, FlaskConical,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { Season } from '@shared'
import { supabase } from '../api/supabase'

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { to: '/today',     label: 'Today',     Icon: CalendarCheck },
    ],
  },
  {
    label: 'Track',
    items: [
      { to: '/garden',    label: 'Garden',    Icon: Sprout     },
      { to: '/bundles',   label: 'Bundles',   Icon: Building2  },
      { to: '/resources', label: 'Resources', Icon: Package    },
      { to: '/birthdays', label: 'Birthdays', Icon: Gift       },
    ],
  },
  {
    label: 'Guide',
    items: [
      { to: '/crops',    label: 'Crops',    Icon: Wheat         },
      { to: '/artisan',  label: 'Artisan',  Icon: FlaskConical  },
      { to: '/fish',     label: 'Fish',     Icon: Fish       },
      { to: '/mining',   label: 'Mining',   Icon: Pickaxe    },
      { to: '/foraging', label: 'Foraging', Icon: Leaf       },
      { to: '/gifts',    label: 'Gifts',    Icon: Heart      },
      { to: '/cooking',  label: 'Cooking',  Icon: ChefHat    },
      { to: '/calendar', label: 'Calendar', Icon: CalendarDays },
      { to: '/tips',     label: 'Tips',     Icon: BookOpen   },
    ],
  },
]

const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_COLOR: Record<Season, string> = {
  spring: 'text-spring', summer: 'text-summer', fall: 'text-fall', winter: 'text-winter',
}

export default function Sidebar() {
  const { currentDay, currentSeason, currentYear, setDay, setSeason, setYear, saveSettings, userName, userAvatar, userId } = useAppStore()

  return (
    <aside className="w-56 min-h-screen flex flex-col bg-green" style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Brand + user */}
      <div className="px-5 pt-7 pb-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Sprout size={16} className="text-cream" />
          </div>
          <div>
            <p className="text-cream font-semibold text-sm leading-tight">Stardew</p>
            <p className="text-green-pale/50 text-[11px] leading-tight">Companion</p>
          </div>
        </div>

        {userId ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {userAvatar
                ? <img src={userAvatar} alt={userName ?? ''} width={24} height={24} className="rounded-full flex-shrink-0" />
                : <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 text-[10px] text-cream font-medium">
                    {userName?.[0] ?? '?'}
                  </div>
              }
              <span className="text-xs text-green-pale/60 truncate">{userName ?? 'Player'}</span>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              title="Sign out"
              className="text-green-pale/30 hover:text-green-pale/60 transition-colors flex-shrink-0"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
            className="w-full flex items-center justify-center gap-2 text-xs bg-white/10 hover:bg-white/20 transition-colors text-cream py-2 rounded-xl font-medium"
          >
            Sign in with Google
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
            {group.label && (
              <p className="text-[9px] uppercase tracking-widest text-green-pale/30 px-3 mb-1">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ to, label, Icon }) => (
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
            </div>
          </div>
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


    </aside>
  )
}

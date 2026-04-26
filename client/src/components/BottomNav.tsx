import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import {
  Home, CalendarCheck, Sprout, Wheat,
  MoreHorizontal, X,
  Building2, Package, Gift, CalendarDays, Fish,
  Pickaxe, TreeDeciduous, Heart, ChefHat, FlaskConical, BookOpen, Egg,
} from 'lucide-react'

const PRIMARY = [
  { to: '/',       label: 'Home',   Icon: Home          },
  { to: '/today',  label: 'Today',  Icon: CalendarCheck },
  { to: '/garden', label: 'Garden', Icon: Sprout        },
  { to: '/crops',  label: 'Crops',  Icon: Wheat         },
]

const MORE_ITEMS = [
  { to: '/artisan',   label: 'Artisan',   Icon: FlaskConical  },
  { to: '/bundles',   label: 'Bundles',   Icon: Building2     },
  { to: '/resources', label: 'Resources', Icon: Package       },
  { to: '/birthdays', label: 'Birthdays', Icon: Gift          },
  { to: '/animals',   label: 'Animals',   Icon: Egg           },
  { to: '/fish',      label: 'Fish',      Icon: Fish          },
  { to: '/mining',    label: 'Mining',    Icon: Pickaxe       },
  { to: '/foraging',  label: 'Foraging',  Icon: TreeDeciduous },
  { to: '/gifts',     label: 'Gifts',     Icon: Heart         },
  { to: '/cooking',   label: 'Cooking',   Icon: ChefHat       },
  { to: '/calendar',  label: 'Calendar',  Icon: CalendarDays  },
  { to: '/tips',      label: 'Tips',      Icon: BookOpen      },
]

export default function BottomNav() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function goTo(to: string) {
    setOpen(false)
    navigate(to)
  }

  return (
    <>
      {/* More sheet overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div className="relative bg-white rounded-t-3xl shadow-2xl px-4 pt-4 pb-safe z-10"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>

            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-ink">All pages</p>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center text-muted"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 pb-2">
              {MORE_ITEMS.map(({ to, label, Icon }) => (
                <button
                  key={to}
                  onClick={() => goTo(to)}
                  className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl bg-cream-dark active:bg-parchment transition-colors"
                >
                  <Icon size={20} className="text-green" strokeWidth={1.75} />
                  <span className="text-[10px] font-medium text-ink leading-none">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav className="bg-green border-t border-white/10 px-1 pb-safe">
        <div className="flex justify-around">
          {PRIMARY.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2.5 transition-all min-w-0 ${
                  isActive ? 'text-cream' : 'text-green-pale/45 hover:text-green-pale/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.75} />
                  <span className="text-[9px] font-medium leading-none truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* More button */}
          <button
            onClick={() => setOpen(true)}
            className={`flex flex-col items-center gap-1 px-3 py-2.5 transition-all min-w-0 ${
              open ? 'text-cream' : 'text-green-pale/45 hover:text-green-pale/70'
            }`}
          >
            <MoreHorizontal size={18} strokeWidth={open ? 2.5 : 1.75} />
            <span className="text-[9px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>
    </>
  )
}

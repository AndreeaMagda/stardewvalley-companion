import { NavLink } from 'react-router'
import {
  Home, Sprout, Wheat, Building2, Gift,
  CalendarDays, Fish, Pickaxe,
} from 'lucide-react'

const NAV = [
  { to: '/',          label: 'Home',      Icon: Home       },
  { to: '/garden',    label: 'Garden',    Icon: Sprout     },
  { to: '/crops',     label: 'Crops',     Icon: Wheat      },
  { to: '/bundles',   label: 'Bundles',   Icon: Building2  },
  { to: '/birthdays', label: 'Birthdays', Icon: Gift       },
  { to: '/calendar',  label: 'Calendar',  Icon: CalendarDays },
  { to: '/fish',      label: 'Fish',      Icon: Fish       },
  { to: '/mining',    label: 'Mining',    Icon: Pickaxe    },
]

export default function BottomNav() {
  return (
    <nav className="bg-green border-t border-white/10 px-1 pb-safe">
      <div className="flex justify-around">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-2.5 transition-all min-w-0 ${
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
      </div>
    </nav>
  )
}

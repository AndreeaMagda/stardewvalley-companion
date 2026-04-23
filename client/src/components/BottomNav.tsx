import { NavLink } from 'react-router'

const NAV = [
  { to: '/garden',    label: 'Garden',    icon: '🌱' },
  { to: '/crops',     label: 'Crops',     icon: '🌾' },
  { to: '/bundles',   label: 'Bundles',   icon: '🏛️' },
  { to: '/birthdays', label: 'Birthdays', icon: '🎁' },
  { to: '/calendar',  label: 'Calendar',  icon: '📅' },
  { to: '/fish',      label: 'Fish',      icon: '🎣' },
  { to: '/resources', label: 'Resources', icon: '🪵' },
]

export default function BottomNav() {
  return (
    <nav className="bg-green border-t border-green-light px-2 pb-safe">
      <div className="flex justify-around">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-2.5 transition-all min-w-0 ${
                isActive ? 'text-cream' : 'text-green-pale/50'
              }`
            }
          >
            <span className="text-xl leading-none">{icon}</span>
            <span className="text-[9px] font-medium leading-none truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

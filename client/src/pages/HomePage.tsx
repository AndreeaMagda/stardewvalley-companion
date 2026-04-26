import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  Sprout, Wheat, Building2, Package, Gift,
  CalendarDays, Fish as FishIcon, Pickaxe, BookOpen,
  Sun, Leaf, Snowflake, CalendarCheck, type LucideIcon,
  TreeDeciduous, Heart, ChefHat,
} from 'lucide-react'
import { VILLAGER_BIRTHDAYS, SEASONAL_EVENTS, FISH } from '@shared'
import type { Season } from '@shared'
import { useAppStore } from '../store/useAppStore'
import { useUserId } from '../hooks/useUserId'
import { supabase } from '../api/supabase'
import { villagerSprite } from '../data/sprites'

const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_ICON: Record<Season, LucideIcon> = {
  spring: Sprout, summer: Sun, fall: Leaf, winter: Snowflake,
}

const SEASON_STYLE: Record<Season, {
  bg: string; border: string; text: string; bar: string; soft: string; muted: string
}> = {
  spring: { bg: 'bg-spring/8',  border: 'border-spring/25',  text: 'text-spring',  bar: 'bg-spring',  soft: 'bg-spring/10',  muted: 'bg-spring/15 text-spring'  },
  summer: { bg: 'bg-summer/8',  border: 'border-summer/25',  text: 'text-summer',  bar: 'bg-summer',  soft: 'bg-summer/10',  muted: 'bg-summer/15 text-summer'  },
  fall:   { bg: 'bg-fall/8',    border: 'border-fall/25',    text: 'text-fall',    bar: 'bg-fall',    soft: 'bg-fall/10',    muted: 'bg-fall/15 text-fall'      },
  winter: { bg: 'bg-winter/8',  border: 'border-winter/25',  text: 'text-winter',  bar: 'bg-winter',  soft: 'bg-winter/10',  muted: 'bg-winter/15 text-winter'  },
}

const NAV_CARDS = [
  { to: '/today',     label: 'Today',     Icon: CalendarCheck, desc: 'Your daily briefing'             },
  { to: '/garden',    label: 'Garden',    Icon: Sprout,       desc: 'Plan crops & track harvests'     },
  { to: '/crops',     label: 'Crops',     Icon: Wheat,        desc: 'Best crops by profit per day'    },
  { to: '/bundles',   label: 'Bundles',   Icon: Building2,    desc: 'Community Center checklist'      },
  { to: '/resources', label: 'Resources', Icon: Package,      desc: 'Materials inventory tracker'     },
  { to: '/birthdays', label: 'Birthdays', Icon: Gift,         desc: 'Never miss a gift day'           },
  { to: '/calendar',  label: 'Calendar',  Icon: CalendarDays, desc: 'Seasonal events & festivals'     },
  { to: '/fish',      label: 'Fish',      Icon: FishIcon,     desc: 'Catch tracker & locations'       },
  { to: '/mining',    label: 'Mining',    Icon: Pickaxe,        desc: 'Mine floors & ore guide'         },
  { to: '/foraging',  label: 'Foraging',  Icon: TreeDeciduous, desc: 'Wild items, locations & prices'  },
  { to: '/gifts',     label: 'Gifts',     Icon: Heart,         desc: 'What every villager loves'        },
  { to: '/cooking',   label: 'Cooking',   Icon: ChefHat,       desc: 'Recipes, ingredients & buffs'     },
  { to: '/tips',      label: 'Tips',      Icon: BookOpen,       desc: 'Tips for new farmers'            },
]

function greeting(name: string | null) {
  const h = new Date().getHours()
  const time = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  return name ? `${time}, ${name.split(' ')[0]}` : null
}

function toAbsDay(season: Season, day: number) {
  return SEASONS.indexOf(season) * 28 + day
}

export default function HomePage() {
  const userId = useUserId()
  const { currentDay, currentSeason, currentYear, userName } = useAppStore()
  const [activeCrops, setActiveCrops] = useState<number | null>(null)

  const s = SEASON_STYLE[currentSeason]
  const daysLeft = 28 - currentDay
  const pct = Math.round((currentDay / 28) * 100)

  const todayBirthday = VILLAGER_BIRTHDAYS.find(
    (v) => v.season === currentSeason && v.day === currentDay,
  )

  const upcomingBirthday = !todayBirthday
    ? VILLAGER_BIRTHDAYS
        .filter((v) => toAbsDay(v.season, v.day) > toAbsDay(currentSeason, currentDay))
        .sort((a, b) => toAbsDay(a.season, a.day) - toAbsDay(b.season, b.day))[0]
    : null

  const nextEvent = [...SEASONAL_EVENTS]
    .filter((e) => toAbsDay(e.season, e.day) > toAbsDay(currentSeason, currentDay))
    .sort((a, b) => toAbsDay(a.season, a.day) - toAbsDay(b.season, b.day))[0]

  const daysUntilEvent = nextEvent
    ? toAbsDay(nextEvent.season, nextEvent.day) - toAbsDay(currentSeason, currentDay)
    : null

  const fishNow = FISH.filter((f) => f.seasons.includes(currentSeason)).length

  useEffect(() => {
    if (!userId) { setActiveCrops(null); return }
    supabase
      .from('garden_entries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('harvested', false)
      .then(({ count }) => setActiveCrops(count ?? 0))
  }, [userId, currentDay, currentSeason, currentYear])

  const hi = greeting(userName)

  return (
    <div className="p-4 md:p-8 max-w-3xl space-y-8">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <div
        className={`rounded-2xl border p-6 ${s.bg} ${s.border}`}
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            {hi && <p className="text-xs text-muted mb-1">{hi}</p>}
            <div className="flex items-center gap-2.5">
              {(() => { const Icon = SEASON_ICON[currentSeason]; return <Icon size={26} className={s.text} strokeWidth={1.5} /> })()}
              <h1 className={`text-3xl font-bold capitalize ${s.text}`}>{currentSeason}</h1>
            </div>
            <p className="text-base text-ink font-medium mt-0.5">
              Day {currentDay} · Year {currentYear}
            </p>
          </div>

          <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl ${s.soft} border ${s.border} flex-shrink-0`}>
            <span className={`text-2xl font-bold leading-none ${s.text}`}>{daysLeft}</span>
            <span className="text-[10px] text-muted mt-0.5 leading-tight text-center">days<br/>left</span>
          </div>
        </div>

        <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${s.bar}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-muted">Day 1</span>
          <span className={`text-[11px] font-medium ${s.text}`}>{pct}% through the season</span>
          <span className="text-[11px] text-muted">Day 28</span>
        </div>
      </div>

      {/* ── At a glance ─────────────────────────────────────────────── */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-muted mb-3">Today at a glance</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          {/* Birthday */}
          <div className="bg-white border border-parchment rounded-2xl p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-[10px] uppercase tracking-widest text-muted mb-2.5">Birthday</p>
            {todayBirthday ? (
              <div className="flex items-center gap-2.5">
                {villagerSprite(todayBirthday.name) && (
                  <img
                    src={villagerSprite(todayBirthday.name)!}
                    alt={todayBirthday.name}
                    width={30}
                    style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-ink leading-tight">{todayBirthday.name}</p>
                  <p className="text-[11px] text-brown font-medium">Today!</p>
                </div>
              </div>
            ) : upcomingBirthday ? (
              <div className="flex items-center gap-2.5">
                {villagerSprite(upcomingBirthday.name) && (
                  <img
                    src={villagerSprite(upcomingBirthday.name)!}
                    alt={upcomingBirthday.name}
                    width={28}
                    style={{ imageRendering: 'pixelated', flexShrink: 0, opacity: 0.75 }}
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-ink leading-tight">{upcomingBirthday.name}</p>
                  <p className="text-[11px] text-muted">
                    {upcomingBirthday.season === currentSeason
                      ? `Day ${upcomingBirthday.day}`
                      : `${upcomingBirthday.season} ${upcomingBirthday.day}`}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">None this year</p>
            )}
          </div>

          {/* Next festival */}
          <div className="bg-white border border-parchment rounded-2xl p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-[10px] uppercase tracking-widest text-muted mb-2.5">Next Festival</p>
            {nextEvent ? (
              <>
                <p className="text-sm font-semibold text-ink leading-snug">{nextEvent.name}</p>
                <p className={`text-[11px] font-medium mt-1 ${s.text}`}>
                  {daysUntilEvent === 1 ? 'Tomorrow!' : `in ${daysUntilEvent} days`}
                </p>
                <p className="text-[10px] text-muted capitalize">{nextEvent.season} {nextEvent.day}</p>
              </>
            ) : (
              <p className="text-sm text-muted">No more this year</p>
            )}
          </div>

          {/* Active crops */}
          <div className="bg-white border border-parchment rounded-2xl p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-[10px] uppercase tracking-widest text-muted mb-2.5">Active Crops</p>
            {userId ? (
              <>
                <p className="text-2xl font-bold text-ink">{activeCrops ?? '…'}</p>
                <p className="text-[11px] text-muted mt-0.5">in the ground</p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-muted/40">—</p>
                <p className="text-[11px] text-muted mt-0.5">Sign in to track</p>
              </>
            )}
          </div>

          {/* Fish in season */}
          <div className="bg-white border border-parchment rounded-2xl p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-[10px] uppercase tracking-widest text-muted mb-2.5">Fish in Season</p>
            <p className="text-2xl font-bold text-ink">{fishNow}</p>
            <p className={`text-[11px] font-medium mt-0.5 capitalize ${s.text}`}>
              {currentSeason} fish
            </p>
          </div>

        </div>
      </div>

      {/* ── Quick nav ───────────────────────────────────────────────── */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-muted mb-3">Explore</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {NAV_CARDS.map(({ to, label, Icon, desc }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white border border-parchment rounded-2xl p-4 hover:border-brown-pale transition-all"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-cream-dark flex items-center justify-center transition-colors group-hover:bg-green/10">
                  <Icon size={15} className="text-muted transition-colors group-hover:text-green" strokeWidth={1.75} />
                </div>
                <p className="font-semibold text-ink text-sm">{label}</p>
              </div>
              <p className="text-xs text-muted leading-snug">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}

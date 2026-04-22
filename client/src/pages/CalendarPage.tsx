import { useState } from 'react'
import { VILLAGER_BIRTHDAYS, SEASONAL_EVENTS } from '@shared'
import type { Season } from '@shared'
import { useAppStore } from '../store/useAppStore'

const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_STYLE: Record<Season, { bg: string; text: string; light: string }> = {
  spring: { bg: 'bg-spring',       text: 'text-spring',  light: 'bg-spring/10' },
  summer: { bg: 'bg-summer',       text: 'text-summer',  light: 'bg-summer/10' },
  fall:   { bg: 'bg-fall',         text: 'text-fall',    light: 'bg-fall/10' },
  winter: { bg: 'bg-winter',       text: 'text-winter',  light: 'bg-winter/10' },
}

export default function CalendarPage() {
  const { currentDay, currentSeason } = useAppStore()
  const [activeSeason, setActiveSeason] = useState<Season>(currentSeason)

  const birthdaysThisSeason = VILLAGER_BIRTHDAYS.filter((v) => v.season === activeSeason)
  const eventsThisSeason = SEASONAL_EVENTS.filter((e) => e.season === activeSeason)

  const getDayData = (day: number) => ({
    birthdays: birthdaysThisSeason.filter((v) => v.day === day).map((v) => v.name),
    events: eventsThisSeason.filter((e) => e.day === day),
  })

  const isToday = (day: number) => activeSeason === currentSeason && day === currentDay

  const style = SEASON_STYLE[activeSeason]

  return (
    <div className="p-8 max-w-4xl">
      <h2 className="text-2xl font-semibold text-ink mb-1">Calendar</h2>
      <p className="text-muted text-sm mb-6">28-day seasonal calendar with events and birthdays.</p>

      {/* Season tabs */}
      <div className="flex gap-2 mb-6">
        {SEASONS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSeason(s)}
            className={`px-4 py-1.5 rounded-lg text-sm capitalize font-medium transition-colors ${
              activeSeason === s
                ? `${SEASON_STYLE[s].bg} text-white`
                : 'bg-cream-dark text-muted hover:bg-parchment'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Day-of-week headers */}
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="text-center text-xs text-muted font-medium py-1">{d}</div>
        ))}

        {/* Day cells: Stardew week starts Mon, 4 weeks = 28 days */}
        {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
          const { birthdays, events } = getDayData(day)
          const today = isToday(day)
          const hasEvent = events.length > 0
          const hasBirthday = birthdays.length > 0

          return (
            <div
              key={day}
              className={`min-h-20 rounded-lg p-1.5 border text-xs transition-all ${
                today
                  ? `border-brown ${style.light} ring-1 ring-brown`
                  : 'border-parchment bg-white hover:border-parchment'
              }`}
            >
              <div className={`font-semibold mb-1 ${today ? style.text + ' font-bold' : 'text-muted'}`}>
                {day}
                {today && <span className="ml-1 text-[10px]">◀</span>}
              </div>

              {hasEvent && events.map((e) => (
                <div
                  key={e.name}
                  className={`${style.light} ${style.text} rounded px-1 py-0.5 mb-0.5 font-medium leading-tight truncate`}
                  title={e.description}
                >
                  🎪 {e.name}
                </div>
              ))}

              {hasBirthday && birthdays.map((name) => (
                <div key={name} className="bg-brown-pale text-brown rounded px-1 py-0.5 mb-0.5 leading-tight truncate">
                  🎂 {name}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-6 text-sm text-muted">
        <span className="flex items-center gap-1.5"><span>🎪</span> Festival</span>
        <span className="flex items-center gap-1.5"><span>🎂</span> Birthday</span>
        <span className={`flex items-center gap-1.5 ${style.text} font-medium`}>◀ Today</span>
      </div>
    </div>
  )
}

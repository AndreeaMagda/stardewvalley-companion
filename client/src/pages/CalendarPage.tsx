import { useState } from 'react'
import { VILLAGER_BIRTHDAYS, SEASONAL_EVENTS } from '@shared'
import type { Season } from '@shared'
import { useAppStore } from '../store/useAppStore'

const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_STYLE: Record<Season, { active: string; text: string; soft: string; bar: string }> = {
  spring: { active: 'bg-spring text-white', text: 'text-spring', soft: 'bg-spring/10', bar: 'bg-spring' },
  summer: { active: 'bg-summer text-white', text: 'text-summer', soft: 'bg-summer/10', bar: 'bg-summer' },
  fall:   { active: 'bg-fall text-white',   text: 'text-fall',   soft: 'bg-fall/10',   bar: 'bg-fall'   },
  winter: { active: 'bg-winter text-white', text: 'text-winter', soft: 'bg-winter/10', bar: 'bg-winter' },
}

export default function CalendarPage() {
  const { currentDay, currentSeason } = useAppStore()
  const [activeSeason, setActiveSeason] = useState<Season>(currentSeason)

  const birthdays = VILLAGER_BIRTHDAYS.filter((v) => v.season === activeSeason)
  const events    = SEASONAL_EVENTS.filter((e) => e.season === activeSeason)
  const style     = SEASON_STYLE[activeSeason]

  const getDayData = (day: number) => ({
    birthdays: birthdays.filter((v) => v.day === day),
    event:     events.find((e) => e.day === day) ?? null,
  })

  const isToday = (day: number) => activeSeason === currentSeason && day === currentDay

  // Upcoming events in current season
  const upcomingEvents = events
    .filter((e) => e.season === currentSeason && e.day >= currentDay)
    .sort((a, b) => a.day - b.day)
    .slice(0, 3)

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-7">
        <h2 className="text-2xl font-semibold text-ink">Calendar</h2>
        <p className="text-muted text-sm mt-1">Festivals, birthdays, and what's coming up.</p>
      </div>

      {/* Upcoming events strip */}
      {upcomingEvents.length > 0 && activeSeason === currentSeason && (
        <div className="flex gap-3 mb-6 flex-wrap">
          {upcomingEvents.map((e) => (
            <div key={e.name} className={`flex items-center gap-3 px-4 py-3 rounded-2xl flex-1 min-w-48 ${style.soft}`}
              style={{ boxShadow: 'var(--shadow-card)' }}>
              <span className="text-2xl">🎪</span>
              <div>
                <p className={`text-sm font-semibold ${style.text}`}>{e.name}</p>
                <p className="text-xs text-muted">Day {e.day} · {e.day - currentDay === 0 ? 'Today!' : `in ${e.day - currentDay} day${e.day - currentDay > 1 ? 's' : ''}`}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Season tabs */}
      <div className="flex gap-1 bg-cream-dark rounded-xl p-1 mb-6">
        {SEASONS.map((s) => (
          <button key={s} onClick={() => setActiveSeason(s)}
            className={`flex-1 py-1.5 rounded-lg text-sm capitalize font-medium transition-all ${
              activeSeason === s ? SEASON_STYLE[s].active : 'text-muted hover:bg-parchment/60'
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Calendar grid */}
        <div className="col-span-2 lg:col-span-1">
          <div className="grid grid-cols-7 gap-1">
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} className="text-center text-[11px] text-muted font-medium py-1">{d}</div>
            ))}
            {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
              const { birthdays: bdays, event } = getDayData(day)
              const today = isToday(day)

              return (
                <div key={day}
                  className={`min-h-16 rounded-xl p-1.5 border text-xs transition-all ${
                    today
                      ? `border-brown ring-1 ring-brown/30 ${style.soft}`
                      : 'border-parchment bg-white hover:border-parchment/80'
                  }`}>
                  <div className={`font-semibold mb-1 text-[11px] ${today ? `${style.text} font-bold` : 'text-muted'}`}>
                    {day}{today && ' ◀'}
                  </div>

                  {/* Event — distinct purple/festival style */}
                  {event && (
                    <div className="bg-brown/10 text-brown rounded px-1 py-0.5 mb-0.5 leading-tight truncate text-[10px] font-medium"
                      title={event.description}>
                      🎪 {event.name.split(' ')[0]}
                    </div>
                  )}

                  {/* Birthdays — distinct green style */}
                  {bdays.map((b) => (
                    <div key={b.name}
                      className={`${style.soft} ${style.text} rounded px-1 py-0.5 mb-0.5 leading-tight truncate text-[10px] font-medium`}
                      title={`${b.name}'s birthday · Loves: ${b.lovedGifts.slice(0,3).join(', ')}`}>
                      🎂 {b.name}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* Event & birthday list sidebar */}
        <div className="col-span-2 lg:col-span-1 space-y-5">

          {/* Festivals */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-3">🎪 Festivals</p>
            <div className="space-y-2">
              {events.length === 0
                ? <p className="text-xs text-muted">No festivals this season.</p>
                : events.map((e) => (
                  <div key={e.name} className="bg-white border border-parchment rounded-2xl px-4 py-3"
                    style={{ boxShadow: 'var(--shadow-card)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-ink text-sm">{e.name}</p>
                      <span className="text-xs bg-brown-pale text-brown px-2 py-0.5 rounded-full font-medium">Day {e.day}</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{e.description}</p>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Birthdays list */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-3">🎂 Birthdays</p>
            <div className="space-y-1.5">
              {birthdays.sort((a, b) => a.day - b.day).map((v) => (
                <div key={v.name}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                    isToday(v.day) ? `border-brown ${style.soft}` : 'bg-white border-parchment'
                  }`}>
                  <span className={`text-xs font-bold w-10 text-center ${style.text}`}>Day {v.day}</span>
                  <p className="text-sm font-medium text-ink flex-1">{v.name}</p>
                  {isToday(v.day) && <span className="text-[11px] bg-brown text-cream px-2 py-0.5 rounded-full">Today!</span>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-6 text-xs text-muted pt-4 border-t border-parchment">
        <span className="flex items-center gap-1.5">🎪 <span className="text-brown font-medium">Festival</span> — brown</span>
        <span className="flex items-center gap-1.5">🎂 <span className={`font-medium ${style.text}`}>Birthday</span> — season color</span>
        <span className="flex items-center gap-1.5">◀ Today</span>
      </div>
    </div>
  )
}

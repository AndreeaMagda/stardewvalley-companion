import { useEffect, useState } from 'react'
import { VILLAGER_BIRTHDAYS } from '@shared'
import type { GiftedBirthday, Season } from '@shared'
import { supabase, USER_ID } from '../api/supabase'
import { useAppStore } from '../store/useAppStore'

const SEASON_TABS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_STYLE: Record<Season, { active: string; dot: string }> = {
  spring: { active: 'bg-spring text-white',  dot: 'bg-spring' },
  summer: { active: 'bg-summer text-white',  dot: 'bg-summer' },
  fall:   { active: 'bg-fall text-white',    dot: 'bg-fall' },
  winter: { active: 'bg-winter text-white',  dot: 'bg-winter' },
}

export default function BirthdaysPage() {
  const { currentDay, currentSeason, currentYear } = useAppStore()
  const [activeSeason, setActiveSeason] = useState<Season>(currentSeason)
  const [gifted, setGifted] = useState<GiftedBirthday[]>([])

  const load = async () => {
    const { data } = await supabase
      .from('gifted_birthdays')
      .select('*')
      .eq('user_id', USER_ID)
      .eq('year', currentYear)
    setGifted((data as GiftedBirthday[]) ?? [])
  }

  useEffect(() => { load() }, [currentYear])

  const isGifted = (name: string) => gifted.some((g) => g.villager_name === name && g.gifted)

  const toggleGifted = async (name: string) => {
    const existing = gifted.find((g) => g.villager_name === name)
    if (existing) {
      await supabase.from('gifted_birthdays').update({ gifted: !existing.gifted }).eq('id', existing.id)
      setGifted((prev) => prev.map((g) => g.id === existing.id ? { ...g, gifted: !g.gifted } : g))
    } else {
      const { data } = await supabase
        .from('gifted_birthdays')
        .upsert({ user_id: USER_ID, villager_name: name, year: currentYear, gifted: true }, { onConflict: 'user_id,villager_name,year' })
        .select()
        .single<GiftedBirthday>()
      if (data) setGifted((prev) => [...prev, data])
    }
  }

  const seasonBirthdays = VILLAGER_BIRTHDAYS
    .filter((v) => v.season === activeSeason)
    .sort((a, b) => a.day - b.day)

  const isToday = (v: typeof seasonBirthdays[number]) =>
    v.season === currentSeason && v.day === currentDay

  const giftedCount = seasonBirthdays.filter((v) => isGifted(v.name)).length

  return (
    <div className="p-8 max-w-2xl">

      <div className="mb-7">
        <h2 className="text-2xl font-semibold text-ink">Birthdays</h2>
        <p className="text-muted text-sm mt-1">Year {currentYear} · gift everyone you can.</p>
      </div>

      {/* Season tabs */}
      <div className="flex gap-1 bg-cream-dark rounded-xl p-1 mb-6">
        {SEASON_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSeason(s)}
            className={`flex-1 py-1.5 rounded-lg text-sm capitalize font-medium transition-all ${
              activeSeason === s
                ? SEASON_STYLE[s].active
                : 'text-muted hover:bg-parchment/60'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-muted">{giftedCount} of {seasonBirthdays.length} gifted</p>
        <div className="h-1.5 w-32 bg-cream-dark rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${SEASON_STYLE[activeSeason].dot}`}
            style={{ width: `${seasonBirthdays.length ? (giftedCount / seasonBirthdays.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {seasonBirthdays.map((v) => {
          const gifted = isGifted(v.name)
          const today = isToday(v)

          return (
            <div
              key={v.name}
              className={`bg-white border rounded-2xl px-5 py-4 flex items-center gap-4 transition-all ${
                today
                  ? 'border-brown bg-brown-pale'
                  : gifted
                  ? 'border-parchment opacity-50'
                  : 'border-parchment hover:border-brown-pale'
              }`}
              style={{ boxShadow: today ? 'var(--shadow-card)' : undefined }}
            >
              {/* Day badge */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                today ? 'bg-brown text-cream' : 'bg-cream-dark text-muted'
              }`}>
                {v.day}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-medium text-ink text-sm ${gifted ? 'line-through' : ''}`}>
                    {v.name}
                  </p>
                  {today && (
                    <span className="text-[11px] bg-brown text-cream px-2 py-0.5 rounded-full font-medium">
                      Today! 🎂
                    </span>
                  )}
                </div>
                {v.lovedGifts.length > 0 && (
                  <p className="text-xs text-muted mt-0.5 truncate">
                    Loves: {v.lovedGifts.slice(0, 3).join(', ')}{v.lovedGifts.length > 3 ? '…' : ''}
                  </p>
                )}
              </div>

              <button
                onClick={() => toggleGifted(v.name)}
                className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all flex-shrink-0 ${
                  gifted
                    ? 'border-green/40 text-green bg-green-pale'
                    : 'border-parchment text-muted hover:border-brown'
                }`}
              >
                {gifted ? '✓ Gifted' : 'Gift'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

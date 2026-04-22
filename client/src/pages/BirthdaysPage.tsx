import { useEffect, useState } from 'react'
import { VILLAGER_BIRTHDAYS } from '@shared'
import type { GiftedBirthday, Season } from '@shared'
import { supabase, USER_ID } from '../api/supabase'
import { useAppStore } from '../store/useAppStore'

const SEASON_TABS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_STYLE: Record<Season, { tab: string; dot: string }> = {
  spring: { tab: 'bg-spring/10 text-spring border-spring/30', dot: 'bg-spring' },
  summer: { tab: 'bg-summer/10 text-summer border-summer/30', dot: 'bg-summer' },
  fall:   { tab: 'bg-fall/10 text-fall border-fall/30', dot: 'bg-fall' },
  winter: { tab: 'bg-winter/10 text-winter border-winter/30', dot: 'bg-winter' },
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
      await supabase
        .from('gifted_birthdays')
        .update({ gifted: !existing.gifted })
        .eq('id', existing.id)
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

  const seasonBirthdays = VILLAGER_BIRTHDAYS.filter((v) => v.season === activeSeason)
    .sort((a, b) => a.day - b.day)

  const isToday = (v: typeof seasonBirthdays[number]) =>
    v.season === currentSeason && v.day === currentDay

  return (
    <div className="p-8 max-w-2xl">
      <h2 className="text-2xl font-semibold text-ink mb-1">Birthdays</h2>
      <p className="text-muted text-sm mb-6">
        Year {currentYear} · mark gifts given
      </p>

      {/* Season tabs */}
      <div className="flex gap-2 mb-6">
        {SEASON_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSeason(s)}
            className={`px-4 py-1.5 rounded-lg text-sm capitalize border transition-colors font-medium ${
              activeSeason === s
                ? SEASON_STYLE[s].tab + ' border-current'
                : 'border-parchment text-muted hover:border-brown-light'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {seasonBirthdays.map((v) => {
          const gifted = isGifted(v.name)
          const today = isToday(v)
          return (
            <div
              key={v.name}
              className={`flex items-center gap-4 bg-white border rounded-xl px-5 py-3 transition-all ${
                today
                  ? 'border-brown bg-brown-pale shadow-sm'
                  : gifted
                  ? 'opacity-50 border-parchment'
                  : 'border-parchment hover:border-brown-light'
              }`}
            >
              <span className="text-lg w-6 text-center">
                {today ? '🎂' : '🎁'}
              </span>
              <div className="flex-1 min-w-0">
                <span className={`font-medium text-ink ${gifted ? 'line-through' : ''}`}>
                  {v.name}
                </span>
                {today && (
                  <span className="ml-2 text-xs bg-brown text-cream px-1.5 py-0.5 rounded font-medium">
                    Today!
                  </span>
                )}
                {v.lovedGifts.length > 0 && (
                  <p className="text-xs text-muted mt-0.5 truncate">
                    Loves: {v.lovedGifts.slice(0, 4).join(', ')}
                    {v.lovedGifts.length > 4 ? '…' : ''}
                  </p>
                )}
              </div>
              <span className={`text-sm font-medium w-12 text-right ${SEASON_STYLE[v.season].tab.split(' ')[1]}`}>
                Day {v.day}
              </span>
              <button
                onClick={() => toggleGifted(v.name)}
                className={`ml-2 text-xs px-2 py-1 rounded border transition-colors ${
                  gifted
                    ? 'border-green text-green bg-green-pale hover:bg-green-pale/70'
                    : 'border-parchment text-muted hover:border-brown-light'
                }`}
              >
                {gifted ? 'Gifted ✓' : 'Gift'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { VILLAGER_BIRTHDAYS } from '@shared'
import type { GiftedBirthday, Season } from '@shared'
import { supabase } from '../api/supabase'
import { useAppStore } from '../store/useAppStore'
import { useUserId } from '../hooks/useUserId'
import { villagerSprite } from '../data/sprites'

const SEASON_TABS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_STYLE: Record<Season, { active: string; soft: string; text: string; dot: string }> = {
  spring: { active: 'bg-spring text-white', soft: 'bg-spring/10',  text: 'text-spring',  dot: 'bg-spring' },
  summer: { active: 'bg-summer text-white', soft: 'bg-summer/10',  text: 'text-summer',  dot: 'bg-summer' },
  fall:   { active: 'bg-fall text-white',   soft: 'bg-fall/10',    text: 'text-fall',    dot: 'bg-fall'   },
  winter: { active: 'bg-winter text-white', soft: 'bg-winter/10',  text: 'text-winter',  dot: 'bg-winter' },
}

export default function BirthdaysPage() {
  const userId = useUserId()
  const { currentDay, currentSeason, currentYear } = useAppStore()
  const [activeSeason, setActiveSeason] = useState<Season>(currentSeason)
  const [gifted, setGifted]             = useState<GiftedBirthday[]>([])
  const [expanded, setExpanded]         = useState<string | null>(null)

  const load = async () => {
    const { data } = await supabase
      .from('gifted_birthdays').select('*')
      .eq('user_id', userId).eq('year', currentYear)
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
        .upsert({ user_id: userId, villager_name: name, year: currentYear, gifted: true }, { onConflict: 'user_id,villager_name,year' })
        .select().single<GiftedBirthday>()
      if (data) setGifted((prev) => [...prev, data])
    }
  }

  const seasonBirthdays = VILLAGER_BIRTHDAYS
    .filter((v) => v.season === activeSeason)
    .sort((a, b) => a.day - b.day)

  const giftedCount = seasonBirthdays.filter((v) => isGifted(v.name)).length
  const style = SEASON_STYLE[activeSeason]

  // Upcoming birthdays in the current season (next 7 days)
  const upcoming = VILLAGER_BIRTHDAYS.filter((v) =>
    v.season === currentSeason &&
    v.day > currentDay &&
    v.day <= currentDay + 7
  ).sort((a, b) => a.day - b.day)

  const todaysBirthday = VILLAGER_BIRTHDAYS.find(
    (v) => v.season === currentSeason && v.day === currentDay
  )

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <div className="mb-7">
        <h2 className="text-2xl font-semibold text-ink">Birthdays</h2>
        <p className="text-muted text-sm mt-1">Year {currentYear} · never miss a birthday gift.</p>
      </div>

      {/* Today's birthday alert */}
      {todaysBirthday && (
        <div className="bg-brown-pale border border-brown/20 rounded-2xl px-5 py-4 mb-5 flex items-center gap-4"
          style={{ boxShadow: 'var(--shadow-card)' }}>
          {villagerSprite(todaysBirthday.name)
            ? <img src={villagerSprite(todaysBirthday.name)} alt={todaysBirthday.name}
                width={40} style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                referrerPolicy="no-referrer" />
            : <span className="text-3xl">🎂</span>
          }
          <div className="flex-1">
            <p className="font-semibold text-ink">It's {todaysBirthday.name}'s birthday today!</p>
            <p className="text-xs text-muted mt-0.5">
              Loves: {todaysBirthday.lovedGifts.slice(0, 4).join(', ')}{todaysBirthday.lovedGifts.length > 4 ? '…' : ''}
            </p>
          </div>
          <button onClick={() => toggleGifted(todaysBirthday.name)}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium border flex-shrink-0 transition-all ${
              isGifted(todaysBirthday.name)
                ? 'bg-green text-cream border-transparent'
                : 'bg-white border-brown text-brown hover:bg-brown hover:text-cream'
            }`}>
            {isGifted(todaysBirthday.name) ? '✓ Gifted' : 'Mark gifted'}
          </button>
        </div>
      )}

      {/* Upcoming (next 7 days) */}
      {upcoming.length > 0 && (
        <div className="bg-white border border-parchment rounded-2xl px-5 py-4 mb-6" style={{ boxShadow: 'var(--shadow-card)' }}>
          <p className="text-xs uppercase tracking-widest text-muted mb-3">Coming up · next 7 days</p>
          <div className="flex flex-wrap gap-2">
            {upcoming.map((v) => (
              <div key={v.name} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${style.soft}`}>
                <span className={`font-semibold ${style.text}`}>Day {v.day}</span>
                <span className="text-ink font-medium">{v.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Season tabs */}
      <div className="flex gap-1 bg-cream-dark rounded-xl p-1 mb-5">
        {SEASON_TABS.map((s) => (
          <button key={s} onClick={() => setActiveSeason(s)}
            className={`flex-1 py-1.5 rounded-lg text-sm capitalize font-medium transition-all ${
              activeSeason === s ? SEASON_STYLE[s].active : 'text-muted hover:bg-parchment/60'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted">{giftedCount} of {seasonBirthdays.length} gifted this year</p>
        <div className="h-1.5 w-28 bg-cream-dark rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${style.dot}`}
            style={{ width: `${seasonBirthdays.length ? (giftedCount / seasonBirthdays.length) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Birthday list */}
      <div className="space-y-2">
        {seasonBirthdays.map((v) => {
          const done    = isGifted(v.name)
          const today   = v.season === currentSeason && v.day === currentDay
          const isOpen  = expanded === v.name

          return (
            <div key={v.name}
              className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                today ? 'border-brown' : done ? 'border-parchment opacity-60' : 'border-parchment hover:border-brown-pale'
              }`}
              style={{ boxShadow: today ? 'var(--shadow-card)' : undefined }}>

              <div className="flex items-center gap-3 px-5 py-3.5">
                {/* Day badge */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                  today ? 'bg-brown text-cream' : `${style.soft} ${style.text}`
                }`}>
                  {v.day}
                </div>

                {/* Portrait */}
                {villagerSprite(v.name)
                  ? <img src={villagerSprite(v.name)} alt={v.name}
                      width={32} style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                      referrerPolicy="no-referrer" />
                  : null
                }

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-medium text-ink text-sm ${done ? 'line-through' : ''}`}>{v.name}</p>
                    {today && <span className="text-[11px] bg-brown text-cream px-2 py-0.5 rounded-full font-medium">Today!</span>}
                  </div>
                  {/* Loved gifts — always show first 3, expand for more */}
                  <p className="text-xs text-muted mt-0.5">
                    ❤️ {v.lovedGifts.slice(0, isOpen ? v.lovedGifts.length : 3).join(', ')}
                    {!isOpen && v.lovedGifts.length > 3 && (
                      <button onClick={() => setExpanded(v.name)}
                        className="ml-1 text-brown hover:underline">
                        +{v.lovedGifts.length - 3} more
                      </button>
                    )}
                    {isOpen && (
                      <button onClick={() => setExpanded(null)} className="ml-1 text-muted hover:underline">less</button>
                    )}
                  </p>
                </div>

                <button onClick={() => toggleGifted(v.name)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-medium flex-shrink-0 transition-all ${
                    done
                      ? 'border-green/40 text-green bg-green-pale'
                      : 'border-parchment text-muted hover:border-brown'
                  }`}>
                  {done ? '✓ Gifted' : 'Gift'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

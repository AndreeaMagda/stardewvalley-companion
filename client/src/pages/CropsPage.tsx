import { useState } from 'react'
import { CROPS } from '@shared'
import type { Crop, Season } from '@shared'
import { useAppStore } from '../store/useAppStore'

type FilterSeason = Season | 'all'

const SEASON_TABS: { value: FilterSeason; label: string; color: string; active: string }[] = [
  { value: 'all',    label: 'All',    color: 'text-muted',   active: 'bg-ink text-cream' },
  { value: 'spring', label: 'Spring', color: 'text-spring',  active: 'bg-spring text-white' },
  { value: 'summer', label: 'Summer', color: 'text-summer',  active: 'bg-summer text-white' },
  { value: 'fall',   label: 'Fall',   color: 'text-fall',    active: 'bg-fall text-white' },
]

const TYPE_BADGE: Record<Crop['type'], string> = {
  vegetable: 'bg-green-pale text-green',
  fruit:     'bg-summer/15 text-summer',
  flower:    'bg-pink-100 text-pink-500',
  grain:     'bg-brown-pale text-brown',
}

const SEASON_DOT: Record<Season, string> = {
  spring: 'bg-spring',
  summer: 'bg-summer',
  fall:   'bg-fall',
  winter: 'bg-winter',
}

export default function CropsPage() {
  const currentSeason = useAppStore((s) => s.currentSeason)
  const [filter, setFilter] = useState<FilterSeason>(currentSeason === 'winter' ? 'all' : currentSeason)
  const [search, setSearch] = useState('')

  const visible = CROPS.filter((c) => {
    const matchesSeason = filter === 'all' || c.seasons.includes(filter)
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    return matchesSeason && matchesSearch
  })

  return (
    <div className="p-8">
      <div className="max-w-5xl">

        {/* Header */}
        <div className="mb-7">
          <h2 className="text-2xl font-semibold text-ink">Crops</h2>
          <p className="text-muted text-sm mt-1">What to plant, how long it takes, and what it's worth.</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Season tabs */}
          <div className="flex gap-1 bg-cream-dark rounded-xl p-1">
            {SEASON_TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setFilter(t.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === t.value ? t.active : `${t.color} hover:bg-parchment/60`
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-auto border border-parchment rounded-xl px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-brown w-40 placeholder:text-muted/50"
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((crop) => (
            <div
              key={crop.id}
              className="bg-white rounded-2xl border border-parchment p-5 flex flex-col gap-3 hover:shadow-lg hover:border-brown-pale transition-all"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              {/* Top row: name + type */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-ink leading-tight">{crop.name}</h3>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0 ${TYPE_BADGE[crop.type]}`}>
                  {crop.type}
                </span>
              </div>

              {/* Grow time — prominent */}
              <div className="bg-cream rounded-xl px-4 py-3 flex items-end gap-2">
                <span className="text-3xl font-bold text-ink leading-none">{crop.growDays}</span>
                <span className="text-sm text-muted mb-0.5">days</span>
                {crop.regrowDays && (
                  <span className="ml-auto text-[11px] bg-green-pale text-green px-2 py-0.5 rounded-full font-medium">
                    ↺ {crop.regrowDays}d
                  </span>
                )}
              </div>

              {/* Seasons */}
              <div className="flex gap-1.5">
                {crop.seasons.map((s) => (
                  <span key={s} className={`text-[11px] flex items-center gap-1 capitalize text-muted`}>
                    <span className={`w-2 h-2 rounded-full inline-block ${SEASON_DOT[s]}`} />
                    {s}
                  </span>
                ))}
              </div>

              {/* Prices */}
              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-parchment/60">
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wide">Seed</p>
                  <p className="text-sm font-medium text-ink">{crop.seedCost}g</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wide">Sell</p>
                  <p className="text-sm font-medium text-ink">{crop.sellPrice}g</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wide">
                    {crop.kegValue ? 'Keg' : crop.jarValue ? 'Jar' : ''}
                  </p>
                  <p className={`text-sm font-medium ${crop.kegValue ? 'text-green' : 'text-brown'}`}>
                    {crop.kegValue ? `${crop.kegValue}g` : crop.jarValue ? `${crop.jarValue}g` : '—'}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {crop.notes && (
                <p className="text-[11px] text-muted italic leading-snug border-t border-parchment/60 pt-2">
                  {crop.notes}
                </p>
              )}
            </div>
          ))}

          {visible.length === 0 && (
            <div className="col-span-full text-center text-muted py-16">
              No crops found.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

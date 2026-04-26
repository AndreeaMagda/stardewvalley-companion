import { useState } from 'react'
import { CROPS } from '@shared'
import type { Crop, Season } from '@shared'
import { useAppStore } from '../store/useAppStore'
import { cropSprite } from '../data/sprites'
import { Sprout } from 'lucide-react'

type FilterSeason = Season | 'all'
type SortKey = 'profit' | 'grow' | 'sell' | 'name'

const SEASON_TABS: { value: FilterSeason; label: string; active: string }[] = [
  { value: 'all',    label: 'All',    active: 'bg-ink text-cream' },
  { value: 'spring', label: 'Spring', active: 'bg-spring text-white' },
  { value: 'summer', label: 'Summer', active: 'bg-summer text-white' },
  { value: 'fall',   label: 'Fall',   active: 'bg-fall text-white' },
]

const TYPE_BADGE: Record<Crop['type'], string> = {
  vegetable: 'bg-green-pale text-green',
  fruit:     'bg-summer/15 text-summer',
  flower:    'bg-pink-100 text-pink-500',
  grain:     'bg-brown-pale text-brown',
}

const SEASON_DOT: Record<Season, string> = {
  spring: 'bg-spring', summer: 'bg-summer', fall: 'bg-fall', winter: 'bg-winter',
}

const SEASON_STYLE: Record<Season, string> = {
  spring: 'ring-spring/30 border-spring/20 bg-spring/5',
  summer: 'ring-summer/30 border-summer/20 bg-summer/5',
  fall:   'ring-fall/30 border-fall/20 bg-fall/5',
  winter: 'ring-winter/30 border-winter/20 bg-winter/5',
}

function bestValue(crop: Crop): number {
  return Math.max(crop.sellPrice, crop.kegValue ?? 0, crop.jarValue ?? 0)
}

function profitPerDay(crop: Crop): number {
  const availableDays = crop.seasons.length * 28
  if (!crop.growDays || crop.growDays > availableDays) return 0
  let harvests: number
  if (crop.regrowDays) {
    harvests = 1 + Math.floor((availableDays - crop.growDays) / crop.regrowDays)
  } else {
    harvests = Math.floor(availableDays / crop.growDays)
  }
  return Math.max(0, Math.round((crop.sellPrice * harvests - crop.seedCost) / availableDays))
}

export default function CropsPage() {
  const currentSeason = useAppStore((s) => s.currentSeason)
  const [filter, setFilter] = useState<FilterSeason>(currentSeason === 'winter' ? 'all' : currentSeason)
  const [sort, setSort]     = useState<SortKey>('profit')
  const [search, setSearch] = useState('')

  const visible = CROPS
    .filter((c) => {
      const matchesSeason = filter === 'all' || c.seasons.includes(filter)
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
      return matchesSeason && matchesSearch
    })
    .sort((a, b) => {
      if (sort === 'profit') return profitPerDay(b) - profitPerDay(a)
      if (sort === 'grow')   return a.growDays - b.growDays
      if (sort === 'sell')   return bestValue(b) - bestValue(a)
      return a.name.localeCompare(b.name)
    })

  const isCurrentSeason = (crop: Crop) => crop.seasons.includes(currentSeason)

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl">

        <div className="mb-7">
          <h2 className="text-2xl font-semibold text-ink">Crops</h2>
          <p className="text-muted text-sm mt-1">What to plant, how long it takes, and what it's worth.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Season filter */}
          <div className="flex gap-1 bg-cream-dark rounded-xl p-1">
            {SEASON_TABS.map((t) => (
              <button key={t.value} onClick={() => setFilter(t.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === t.value ? t.active : 'text-muted hover:bg-parchment/60'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-1 bg-cream-dark rounded-xl p-1">
            {([['profit','Profit/day'],['grow','Grow time'],['sell','Best price'],['name','Name']] as [SortKey, string][]).map(([key, label]) => (
              <button key={key} onClick={() => setSort(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sort === key ? 'bg-brown text-cream' : 'text-muted hover:bg-parchment/60'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <input type="text" placeholder="Search…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-auto border border-parchment rounded-xl px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-brown w-36 placeholder:text-muted/50" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((crop) => {
            const inSeason = isCurrentSeason(crop)
            const gpd = profitPerDay(crop)
            const best = bestValue(crop)

            return (
              <div key={crop.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col gap-3 transition-all hover:shadow-lg ${
                  inSeason ? `${SEASON_STYLE[currentSeason]} ring-1` : 'border-parchment hover:border-brown-pale'
                }`}
                style={{ boxShadow: 'var(--shadow-card)' }}>

                {/* Sprite */}
                <div className="flex items-center justify-between gap-2">
                  {cropSprite(crop.id)
                    ? <img src={cropSprite(crop.id)} alt={crop.name}
                        style={{ imageRendering: 'pixelated', width: 48, height: 48 }}
                        referrerPolicy="no-referrer" />
                    : <Sprout size={40} className="text-green/40" strokeWidth={1.25} />
                  }
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0 ${TYPE_BADGE[crop.type]}`}>
                    {crop.type}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-semibold text-ink leading-tight -mt-1">{crop.name}</h3>

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
                <div className="flex flex-wrap gap-2 items-center">
                  {crop.seasons.map((s) => (
                    <span key={s} className="text-[11px] flex items-center gap-1 text-muted capitalize">
                      <span className={`w-2 h-2 rounded-full inline-block ${SEASON_DOT[s]}`} />
                      {s}
                    </span>
                  ))}
                  {crop.seasons.length > 1 && (
                    <span className="text-[10px] bg-brown/10 text-brown px-1.5 py-0.5 rounded-full font-medium ml-auto">
                      56d window
                    </span>
                  )}
                </div>

                {/* Prices */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-parchment/60">
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-wide">Seed</p>
                    <p className="text-sm font-medium text-ink">{crop.seedCost}g</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-wide">Sell</p>
                    <p className="text-sm font-medium text-ink">{crop.sellPrice}g</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-wide">Best</p>
                    <p className={`text-sm font-medium ${best > crop.sellPrice ? 'text-green' : 'text-ink'}`}>{best}g</p>
                  </div>
                </div>

                {/* Profit/day */}
                <div className="flex items-center justify-between pt-1 border-t border-parchment/60">
                  <span className="text-[11px] text-muted">Profit / day</span>
                  <span className={`text-sm font-bold ${gpd >= 20 ? 'text-green' : gpd >= 10 ? 'text-summer' : 'text-muted'}`}>
                    ~{gpd}g
                  </span>
                </div>

                {crop.notes && (
                  <p className="text-[11px] text-muted italic leading-snug border-t border-parchment/60 pt-2">{crop.notes}</p>
                )}
              </div>
            )
          })}

          {visible.length === 0 && (
            <div className="col-span-full text-center text-muted py-16">No crops found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

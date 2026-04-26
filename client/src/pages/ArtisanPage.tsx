import { useState } from 'react'
import { CROPS } from '@shared'
import type { Crop, Season } from '@shared'
import { useAppStore } from '../store/useAppStore'
import { cropSprite } from '../data/sprites'
import { FlaskConical, Sprout } from 'lucide-react'

// ── helpers ───────────────────────────────────────────────────────────────────

function kegLabel(crop: Crop): string {
  if (crop.id === 'hops')  return 'Pale Ale'
  if (crop.id === 'wheat') return 'Beer'
  return crop.type === 'fruit' ? 'Wine' : 'Juice'
}

function jarLabel(crop: Crop): string {
  return crop.type === 'fruit' ? 'Jelly' : 'Pickles'
}

function applyArtisan(value: number, artisan: boolean) {
  return artisan ? Math.floor(value * 1.4) : value
}

function fmt(n: number) {
  return n.toLocaleString()
}

// ── types & data ──────────────────────────────────────────────────────────────

type FilterSeason = Season | 'all'
type SortKey = 'best' | 'gain' | 'raw' | 'multiple'

const ARTISAN_CROPS = CROPS.filter((c) => c.kegValue || c.jarValue)

const SEASON_TABS: { value: FilterSeason; label: string; active: string }[] = [
  { value: 'all',    label: 'All',    active: 'bg-ink text-cream' },
  { value: 'spring', label: 'Spring', active: 'bg-spring text-white' },
  { value: 'summer', label: 'Summer', active: 'bg-summer text-white' },
  { value: 'fall',   label: 'Fall',   active: 'bg-fall text-white' },
]

const SEASON_DOT: Record<Season, string> = {
  spring: 'bg-spring', summer: 'bg-summer', fall: 'bg-fall', winter: 'bg-winter',
}

// ── component ──────────────────────────────────────────────────────────────────

export default function ArtisanPage() {
  const currentSeason = useAppStore((s) => s.currentSeason)
  const [filter,  setFilter]  = useState<FilterSeason>(currentSeason === 'winter' ? 'all' : currentSeason)
  const [sort,    setSort]    = useState<SortKey>('best')
  const [artisan, setArtisan] = useState(false)

  const visible = ARTISAN_CROPS
    .filter((c) => filter === 'all' || c.seasons.includes(filter))
    .map((c) => {
      const keg = c.kegValue ? applyArtisan(c.kegValue, artisan) : null
      const jar = c.jarValue ? applyArtisan(c.jarValue, artisan) : null
      const best = Math.max(keg ?? 0, jar ?? 0)
      const gain = best - c.sellPrice
      const multiple = best / c.sellPrice
      return { crop: c, keg, jar, best, gain, multiple }
    })
    .sort((a, b) => {
      if (sort === 'best')     return b.best     - a.best
      if (sort === 'gain')     return b.gain     - a.gain
      if (sort === 'raw')      return b.crop.sellPrice - a.crop.sellPrice
      if (sort === 'multiple') return b.multiple - a.multiple
      return 0
    })

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="mb-7">
        <h2 className="text-2xl font-semibold text-ink">Artisan Goods</h2>
        <p className="text-muted text-sm mt-1">Keg vs preserves jar vs raw — find the best way to process each crop.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Season filter */}
        <div className="flex gap-1 bg-cream-dark rounded-xl p-1">
          {SEASON_TABS.map((t) => (
            <button key={t.value} onClick={() => setFilter(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === t.value ? t.active : 'text-muted hover:bg-parchment/60'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-1 bg-cream-dark rounded-xl p-1">
          {([['best','Best value'],['gain','Most gain'],['multiple','Multiplier'],['raw','Raw price']] as [SortKey,string][]).map(([key,label]) => (
            <button key={key} onClick={() => setSort(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sort === key ? 'bg-brown text-cream' : 'text-muted hover:bg-parchment/60'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Artisan toggle */}
        <label className="flex items-center gap-2 ml-auto cursor-pointer select-none">
          <div
            onClick={() => setArtisan((v) => !v)}
            className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${artisan ? 'bg-green' : 'bg-parchment'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${artisan ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className="text-xs text-muted">Artisan profession <span className="text-[10px]">(+40%)</span></span>
        </label>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {visible.map(({ crop, keg, jar, best, gain, multiple }) => {
          const sprite = cropSprite(crop.id)
          const bestIsKeg = keg !== null && keg >= (jar ?? 0)
          const bestIsJar = jar !== null && jar > (keg ?? 0)

          return (
            <div key={crop.id}
              className="bg-white border border-parchment rounded-2xl p-4 hover:border-brown-pale transition-all"
              style={{ boxShadow: 'var(--shadow-card)' }}>

              {/* Header row */}
              <div className="flex items-center gap-3 mb-4">
                {sprite
                  ? <img src={sprite} alt={crop.name} width={32} height={32}
                      style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                      referrerPolicy="no-referrer" />
                  : <Sprout size={28} className="text-green/40 flex-shrink-0" strokeWidth={1.25} />
                }
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-sm leading-tight">{crop.name}</p>
                  <div className="flex gap-1.5 mt-0.5">
                    {crop.seasons.map((s) => (
                      <span key={s} className="flex items-center gap-1 text-[10px] text-muted capitalize">
                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${SEASON_DOT[s]}`} />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-green leading-tight">{fmt(best)}g</p>
                  <p className="text-[10px] text-muted">+{fmt(gain)}g · ×{multiple.toFixed(1)}</p>
                </div>
              </div>

              {/* Comparison row */}
              <div className="grid grid-cols-3 gap-2">
                {/* Raw */}
                <div className="bg-cream-dark rounded-xl p-3 text-center">
                  <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Raw</p>
                  <p className="text-sm font-bold text-ink">{fmt(crop.sellPrice)}g</p>
                  <p className="text-[10px] text-muted mt-0.5">×1.0</p>
                </div>

                {/* Jar */}
                <div className={`rounded-xl p-3 text-center border transition-all ${
                  bestIsJar
                    ? 'bg-spring/10 border-spring/30'
                    : 'bg-cream-dark border-transparent'
                }`}>
                  <p className="text-[10px] text-muted uppercase tracking-wide mb-1">
                    {jar !== null ? jarLabel(crop) : '—'}
                  </p>
                  {jar !== null ? (
                    <>
                      <p className={`text-sm font-bold ${bestIsJar ? 'text-green' : 'text-ink'}`}>{fmt(jar)}g</p>
                      <p className="text-[10px] text-muted mt-0.5">×{(jar / crop.sellPrice).toFixed(1)}</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted/40">—</p>
                  )}
                  {bestIsJar && <p className="text-[9px] text-green font-semibold mt-1 uppercase tracking-wide">Best</p>}
                </div>

                {/* Keg */}
                <div className={`rounded-xl p-3 text-center border transition-all ${
                  bestIsKeg
                    ? 'bg-spring/10 border-spring/30'
                    : 'bg-cream-dark border-transparent'
                }`}>
                  <p className="text-[10px] text-muted uppercase tracking-wide mb-1">
                    {keg !== null ? kegLabel(crop) : '—'}
                  </p>
                  {keg !== null ? (
                    <>
                      <p className={`text-sm font-bold ${bestIsKeg ? 'text-green' : 'text-ink'}`}>{fmt(keg)}g</p>
                      <p className="text-[10px] text-muted mt-0.5">×{(keg / crop.sellPrice).toFixed(1)}</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted/40">—</p>
                  )}
                  {bestIsKeg && <p className="text-[9px] text-green font-semibold mt-1 uppercase tracking-wide">Best</p>}
                </div>
              </div>

              {crop.notes && (
                <p className="text-[11px] text-brown/70 leading-snug border-l-2 border-brown/20 pl-2 mt-3">{crop.notes}</p>
              )}
            </div>
          )
        })}

        {visible.length === 0 && (
          <p className="text-muted text-sm text-center py-12">No crops for this season.</p>
        )}
      </div>
    </div>
  )
}

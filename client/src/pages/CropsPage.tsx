import { useState } from 'react'
import { CROPS } from '@shared'
import type { Season } from '@shared'
import { useAppStore } from '../store/useAppStore'

const SEASON_OPTIONS: (Season | 'all')[] = ['all', 'spring', 'summer', 'fall']

const SEASON_BADGE: Record<Season, string> = {
  spring: 'bg-spring/20 text-spring',
  summer: 'bg-summer/20 text-summer',
  fall:   'bg-fall/20 text-fall',
  winter: 'bg-winter/20 text-winter',
}

export default function CropsPage() {
  const currentSeason = useAppStore((s) => s.currentSeason)
  const [filter, setFilter] = useState<Season | 'all'>(currentSeason === 'winter' ? 'all' : currentSeason)
  const [search, setSearch] = useState('')

  const visible = CROPS.filter((c) => {
    const matchesSeason = filter === 'all' || c.seasons.includes(filter)
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    return matchesSeason && matchesSearch
  })

  return (
    <div className="p-8 max-w-5xl">
      <h2 className="text-2xl font-semibold text-ink mb-1">Crops</h2>
      <p className="text-muted text-sm mb-6">Sell prices, keg/jar values, and growth info.</p>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search crops…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-parchment rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-brown w-44"
        />
        {SEASON_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors border ${
              filter === s
                ? 'bg-brown text-cream border-brown'
                : 'border-parchment text-muted hover:border-brown-light'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-parchment overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-dark border-b border-parchment">
            <tr>
              <th className="text-left px-4 py-3 text-muted font-medium">Crop</th>
              <th className="text-left px-4 py-3 text-muted font-medium">Season</th>
              <th className="text-right px-4 py-3 text-muted font-medium">Seed</th>
              <th className="text-right px-4 py-3 text-muted font-medium">Grow</th>
              <th className="text-right px-4 py-3 text-muted font-medium">Regrow</th>
              <th className="text-right px-4 py-3 text-muted font-medium">Sell</th>
              <th className="text-right px-4 py-3 text-muted font-medium">Keg</th>
              <th className="text-right px-4 py-3 text-muted font-medium">Jar</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((crop, i) => (
              <tr
                key={crop.id}
                className={`border-b border-parchment/50 hover:bg-cream transition-colors ${i % 2 === 0 ? '' : 'bg-cream/40'}`}
              >
                <td className="px-4 py-2.5 font-medium text-ink">
                  {crop.name}
                  {crop.notes && (
                    <span className="ml-1.5 text-xs text-muted" title={crop.notes}>ⓘ</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1 flex-wrap">
                    {crop.seasons.map((s) => (
                      <span key={s} className={`text-xs px-1.5 py-0.5 rounded capitalize font-medium ${SEASON_BADGE[s]}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right text-muted">{crop.seedCost}g</td>
                <td className="px-4 py-2.5 text-right text-muted">{crop.growDays}d</td>
                <td className="px-4 py-2.5 text-right text-muted">
                  {crop.regrowDays ? `${crop.regrowDays}d` : '—'}
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-ink">{crop.sellPrice}g</td>
                <td className="px-4 py-2.5 text-right text-green font-medium">
                  {crop.kegValue ? `${crop.kegValue}g` : '—'}
                </td>
                <td className="px-4 py-2.5 text-right text-brown font-medium">
                  {crop.jarValue ? `${crop.jarValue}g` : '—'}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-muted py-8">No crops found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

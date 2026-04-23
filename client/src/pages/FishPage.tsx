import { useEffect, useState } from 'react'
import { FISH } from '@shared'
import type { Fish, CaughtFish, Season } from '@shared'
import { supabase, USER_ID } from '../api/supabase'
import { useAppStore } from '../store/useAppStore'

type FilterTab = 'current' | Season | 'legendary'
type WeatherFilter = 'any' | 'sun' | 'rain'

const SEASON_TABS: { id: FilterTab; label: string }[] = [
  { id: 'current',   label: '★ Now'     },
  { id: 'spring',    label: 'Spring'    },
  { id: 'summer',    label: 'Summer'    },
  { id: 'fall',      label: 'Fall'      },
  { id: 'winter',    label: 'Winter'    },
  { id: 'legendary', label: '🌟 Legend' },
]

const SEASON_STYLE: Record<Season, string> = {
  spring: 'bg-spring text-white',
  summer: 'bg-summer text-white',
  fall:   'bg-fall text-white',
  winter: 'bg-winter text-white',
}

function difficultyColor(d: number) {
  if (d <= 40)  return 'bg-spring'
  if (d <= 65)  return 'bg-summer'
  if (d <= 85)  return 'bg-fall'
  return 'bg-red-400'
}

function difficultyLabel(d: number) {
  if (d <= 40)  return 'Easy'
  if (d <= 65)  return 'Medium'
  if (d <= 85)  return 'Hard'
  return 'Expert'
}

function difficultyText(d: number) {
  if (d <= 40)  return 'text-spring'
  if (d <= 65)  return 'text-summer'
  if (d <= 85)  return 'text-fall'
  return 'text-red-500'
}

function weatherIcon(w: Fish['weather']) {
  if (w === 'sun')  return '☀️'
  if (w === 'rain') return '🌧️'
  return null
}

// Wiki sprites — 48px thumbnails (3× the in-game 16px, keeps pixel-art crispness)
const W = 'https://stardewvalleywiki.com/mediawiki/images/thumb'
const SPRITES: Record<string, string> = {
  carp:           `${W}/a/a8/Carp.png/24px-Carp.png`,
  largemouth:     `${W}/1/11/Largemouth_Bass.png/24px-Largemouth_Bass.png`,
  bullhead:       `${W}/d/db/Bullhead.png/24px-Bullhead.png`,
  woodskip:       `${W}/9/97/Woodskip.png/24px-Woodskip.png`,
  ghostfish:      `${W}/7/72/Ghostfish.png/24px-Ghostfish.png`,
  stonefish:      `${W}/0/03/Stonefish.png/24px-Stonefish.png`,
  ice_pip:        `${W}/6/63/Ice_Pip.png/24px-Ice_Pip.png`,
  lava_eel:       `${W}/1/12/Lava_Eel.png/24px-Lava_Eel.png`,
  void_salmon:    `${W}/a/ad/Void_Salmon.png/24px-Void_Salmon.png`,
  slimejack:      `${W}/3/34/Slimejack.png/24px-Slimejack.png`,
  mutant_carp:    `${W}/c/cb/Mutant_Carp.png/24px-Mutant_Carp.png`,
  sardine:        `${W}/0/04/Sardine.png/24px-Sardine.png`,
  smallmouth:     `${W}/a/a5/Smallmouth_Bass.png/24px-Smallmouth_Bass.png`,
  catfish:        `${W}/9/99/Catfish.png/24px-Catfish.png`,
  eel:            `${W}/9/91/Eel.png/24px-Eel.png`,
  shad:           `${W}/e/ef/Shad.png/24px-Shad.png`,
  legend:         `${W}/1/10/Legend.png/24px-Legend.png`,
  pufferfish:     `${W}/b/ba/Pufferfish.png/24px-Pufferfish.png`,
  tuna:           `${W}/c/c5/Tuna.png/24px-Tuna.png`,
  red_snapper:    `${W}/d/d3/Red_Snapper.png/24px-Red_Snapper.png`,
  tilapia:        `${W}/7/73/Tilapia.png/24px-Tilapia.png`,
  pike:           `${W}/3/31/Pike.png/24px-Pike.png`,
  octopus:        `${W}/5/5a/Octopus.png/24px-Octopus.png`,
  super_cucumber: `${W}/d/d5/Super_Cucumber.png/24px-Super_Cucumber.png`,
  crimsonfish:    `${W}/d/dc/Crimsonfish.png/24px-Crimsonfish.png`,
  salmon:         `${W}/e/e0/Salmon.png/24px-Salmon.png`,
  walleye:        `${W}/0/05/Walleye.png/24px-Walleye.png`,
  tiger_trout:    `${W}/0/01/Tiger_Trout.png/24px-Tiger_Trout.png`,
  albacore:       `${W}/e/e1/Albacore.png/24px-Albacore.png`,
  midnight_carp:  `${W}/3/33/Midnight_Carp.png/24px-Midnight_Carp.png`,
  angler:         `${W}/b/bf/Angler.png/24px-Angler.png`,
  squid:          `${W}/8/81/Squid.png/24px-Squid.png`,
  lingcod:        `${W}/8/87/Lingcod.png/24px-Lingcod.png`,
  spook_fish:     `${W}/8/8c/Spook_Fish.png/24px-Spook_Fish.png`,
  blobfish:       `${W}/7/7f/Blobfish.png/24px-Blobfish.png`,
  midnight_squid: `${W}/8/83/Midnight_Squid.png/24px-Midnight_Squid.png`,
  glacierfish:    `${W}/f/fd/Glacierfish.png/24px-Glacierfish.png`,
}

export default function FishPage() {
  const { currentSeason } = useAppStore()
  const [caught, setCaught]       = useState<CaughtFish[]>([])
  const [tab, setTab]             = useState<FilterTab>('current')
  const [weatherFilter, setWeatherFilter] = useState<WeatherFilter>('any')
  const [loading, setLoading]     = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('caught_fish')
      .select('*')
      .eq('user_id', USER_ID)
    setCaught((data as CaughtFish[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const isCaught = (fishId: string) =>
    caught.some((c) => c.fish_id === fishId && c.caught)

  const toggleCaught = async (fish: Fish) => {
    const existing = caught.find((c) => c.fish_id === fish.id)
    if (existing) {
      const next = !existing.caught
      await supabase.from('caught_fish').update({ caught: next }).eq('id', existing.id)
      setCaught((prev) => prev.map((c) => c.id === existing.id ? { ...c, caught: next } : c))
    } else {
      const { data } = await supabase
        .from('caught_fish')
        .upsert({ user_id: USER_ID, fish_id: fish.id, caught: true }, { onConflict: 'user_id,fish_id' })
        .select().single<CaughtFish>()
      if (data) setCaught((prev) => [...prev, data])
    }
  }

  // Filtering
  const filteredFish = FISH.filter((f) => {
    if (tab === 'legendary') return f.legendary
    if (tab === 'current')   return f.seasons.includes(currentSeason)
    if (tab !== 'current' && tab !== 'legendary') return f.seasons.includes(tab as Season)
    return true
  }).filter((f) => {
    if (weatherFilter === 'any') return true
    return f.weather === weatherFilter || f.weather === 'any'
  })

  // Progress
  const totalCaught    = FISH.filter((f) => isCaught(f.id)).length
  const legendsCaught  = FISH.filter((f) => f.legendary && isCaught(f.id)).length
  const totalLegendary = FISH.filter((f) => f.legendary).length

  const activeTabStyle = tab === 'current' ? 'bg-brown text-cream'
    : tab === 'legendary' ? 'bg-brown text-cream'
    : SEASON_STYLE[tab as Season]

  return (
    <div className="p-4 md:p-8 max-w-3xl">

      {/* Header */}
      <div className="mb-7">
        <h2 className="text-2xl font-semibold text-ink">Fish Tracker</h2>
        <p className="text-muted text-sm mt-1">Track every fish you've caught.</p>
      </div>

      {/* Progress cards */}
      <div className="grid grid-cols-2 gap-3 mb-7">
        <div className="bg-white border border-parchment rounded-2xl p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
          <p className="text-xs text-muted mb-1">Total caught</p>
          <p className="text-2xl font-bold text-ink">{totalCaught}<span className="text-sm font-normal text-muted"> / {FISH.length}</span></p>
          <div className="h-1.5 w-full bg-cream-dark rounded-full overflow-hidden mt-2">
            <div className="h-full bg-winter rounded-full transition-all duration-500"
              style={{ width: `${FISH.length ? (totalCaught / FISH.length) * 100 : 0}%` }} />
          </div>
        </div>
        <div className="bg-white border border-parchment rounded-2xl p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
          <p className="text-xs text-muted mb-1">Legendary fish</p>
          <p className="text-2xl font-bold text-ink">{legendsCaught}<span className="text-sm font-normal text-muted"> / {totalLegendary}</span></p>
          <div className="h-1.5 w-full bg-cream-dark rounded-full overflow-hidden mt-2">
            <div className="h-full bg-brown rounded-full transition-all duration-500"
              style={{ width: `${totalLegendary ? (legendsCaught / totalLegendary) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Season tabs */}
      <div className="flex gap-1 bg-cream-dark rounded-xl p-1 mb-3">
        {SEASON_TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              tab === id ? activeTabStyle : 'text-muted hover:bg-parchment/60'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Weather filter */}
      <div className="flex gap-2 mb-6">
        {(['any', 'sun', 'rain'] as WeatherFilter[]).map((w) => (
          <button key={w} onClick={() => setWeatherFilter(w)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              weatherFilter === w
                ? 'bg-ink text-cream border-ink'
                : 'bg-white border-parchment text-muted hover:border-brown-light'
            }`}>
            {w === 'any' ? 'Any weather' : w === 'sun' ? '☀️ Sunny' : '🌧️ Rainy'}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted self-center">{filteredFish.length} fish</span>
      </div>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : (
        <div className="space-y-2">
          {filteredFish.map((fish) => {
            const done = isCaught(fish.id)
            const wIcon = weatherIcon(fish.weather)

            return (
              <div key={fish.id}
                className={`bg-white border rounded-2xl px-4 py-3 flex items-center gap-3 transition-all ${
                  done ? 'border-parchment opacity-60' : 'border-parchment hover:border-brown-pale'
                }`}
                style={{ boxShadow: 'var(--shadow-card)' }}>

                {/* Sprite */}
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  {SPRITES[fish.id]
                    ? <img src={SPRITES[fish.id]} alt={fish.name}
                        style={{ imageRendering: 'pixelated', width: 40, height: 40 }}
                        referrerPolicy="no-referrer" />
                    : <span className="text-2xl">🐟</span>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className={`text-sm font-semibold text-ink ${done ? 'line-through' : ''}`}>
                      {fish.name}
                    </p>
                    {fish.legendary && (
                      <span className="text-[10px] bg-brown/10 text-brown px-1.5 py-0.5 rounded-full font-medium">Legendary</span>
                    )}
                    <span className={`text-[10px] font-semibold ${difficultyText(fish.difficulty)}`}>
                      {difficultyLabel(fish.difficulty)}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5 truncate">{fish.location}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[11px] text-muted">{fish.time}</span>
                    {wIcon && <span className="text-[11px]">{wIcon}</span>}
                    {fish.weather === 'any' && <span className="text-[11px] text-muted">Any weather</span>}
                  </div>
                </div>

                {/* Price + button */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-xs font-medium text-muted">{fish.sellPrice.toLocaleString()}g</span>
                  <button
                    onClick={() => toggleCaught(fish)}
                    className={`text-xs px-3 py-1 rounded-xl border font-medium transition-all ${
                      done
                        ? 'bg-green/10 text-green border-green/30'
                        : 'bg-white border-parchment text-muted hover:border-winter hover:text-winter'
                    }`}>
                    {done ? '✓ Caught' : 'Catch'}
                  </button>
                </div>
              </div>
            )
          })}

          {filteredFish.length === 0 && (
            <p className="text-center text-muted text-sm py-10">No fish match these filters.</p>
          )}
        </div>
      )}
    </div>
  )
}

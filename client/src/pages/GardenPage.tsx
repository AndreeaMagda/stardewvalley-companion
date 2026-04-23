import { useEffect, useRef, useState } from 'react'
import { CROPS } from '@shared'
import type { Crop, GardenEntry, Season } from '@shared'
import { supabase, USER_ID } from '../api/supabase'
import { useAppStore } from '../store/useAppStore'

// ── helpers ───────────────────────────────────────────────────────────────────

const SEASON_INDEX: Record<Season, number> = { spring: 0, summer: 1, fall: 2, winter: 3 }
const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_STYLE: Record<Season, { active: string; soft: string; text: string; bar: string; ring: string }> = {
  spring: { active: 'bg-spring text-white', soft: 'bg-spring/10', text: 'text-spring', bar: 'bg-spring', ring: 'ring-spring/30' },
  summer: { active: 'bg-summer text-white', soft: 'bg-summer/10', text: 'text-summer', bar: 'bg-summer', ring: 'ring-summer/30' },
  fall:   { active: 'bg-fall text-white',   soft: 'bg-fall/10',   text: 'text-fall',   bar: 'bg-fall',   ring: 'ring-fall/30'   },
  winter: { active: 'bg-winter text-white', soft: 'bg-winter/10', text: 'text-winter', bar: 'bg-winter', ring: 'ring-winter/30' },
}

function possibleHarvests(crop: Crop, currentDay: number): number {
  const daysLeft = 28 - currentDay
  if (daysLeft < crop.growDays) return 0
  if (!crop.regrowDays) return 1
  return 1 + Math.floor((daysLeft - crop.growDays) / crop.regrowDays)
}

function profitPerDay(crop: Crop, currentDay: number): number {
  const harvests = possibleHarvests(crop, currentDay)
  if (!harvests) return 0
  const daysLeft = 28 - currentDay
  return Math.round((crop.sellPrice * harvests - crop.seedCost) / Math.max(1, daysLeft))
}

function toAbsoluteDay(year: number, season: Season, day: number) {
  return (year - 1) * 112 + SEASON_INDEX[season] * 28 + day
}

function getHarvestInfo(entry: GardenEntry, year: number, season: Season, day: number) {
  const crop = CROPS.find((c) => c.id === entry.crop_id)
  if (!crop) return null
  const elapsed = toAbsoluteDay(year, season, day) - toAbsoluteDay(entry.planted_year, entry.season, entry.day)
  if (elapsed < 0) return { ready: false, daysLeft: crop.growDays, progress: 0, daysUntilNext: null }
  if (elapsed >= crop.growDays) {
    const extra = elapsed - crop.growDays
    const daysUntilNext = crop.regrowDays ? crop.regrowDays - (extra % crop.regrowDays) : null
    return { ready: true, daysLeft: 0, progress: 100, daysUntilNext }
  }
  return {
    ready: false,
    daysLeft: crop.growDays - elapsed,
    progress: Math.round((elapsed / crop.growDays) * 100),
    daysUntilNext: null,
  }
}

function progressBarColor(progress: number, ready: boolean): string {
  if (ready) return 'bg-green'
  if (progress < 35) return 'bg-brown-light'
  if (progress < 70) return 'bg-summer'
  return 'bg-spring'
}

// ── component ─────────────────────────────────────────────────────────────────

export default function GardenPage() {
  const { currentDay, currentSeason, currentYear, setDay, setSeason, setYear, saveSettings } = useAppStore()
  const [entries, setEntries]     = useState<GardenEntry[]>([])
  const [loading, setLoading]     = useState(true)
  const [adding, setAdding]       = useState(false)
  const [addError, setAddError]   = useState<string | null>(null)
  const [newCropId, setNewCropId] = useState(CROPS[0].id)
  const [newNotes, setNewNotes]   = useState('')
  const [showAll, setShowAll]     = useState(false)
  const [toast, setToast]         = useState<{ id: number; names: string[] } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('garden_entries').select('*').eq('user_id', USER_ID)
      .order('created_at', { ascending: false })
    setEntries((data as GardenEntry[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // ── advance day ──────────────────────────────────────────────────────────────

  const advanceDay = () => {
    const isLastDay   = currentDay >= 28
    const nextDay     = isLastDay ? 1 : currentDay + 1
    const seasonIdx   = SEASON_INDEX[currentSeason]
    const nextSeason  = isLastDay ? SEASONS[(seasonIdx + 1) % 4] as Season : currentSeason
    const nextYear    = isLastDay && currentSeason === 'winter' ? currentYear + 1 : currentYear

    const newlyReady = entries
      .filter((e) => !e.harvested)
      .filter((e) => {
        const before = getHarvestInfo(e, currentYear, currentSeason, currentDay)?.ready
        const after  = getHarvestInfo(e, nextYear, nextSeason, nextDay)?.ready
        return !before && after
      })
      .map((e) => CROPS.find((c) => c.id === e.crop_id)?.name ?? e.crop_id)

    setDay(nextDay); setSeason(nextSeason); setYear(nextYear)
    saveSettings()

    if (newlyReady.length > 0) {
      if (toastTimer.current) clearTimeout(toastTimer.current)
      setToast({ id: Date.now(), names: newlyReady })
      toastTimer.current = setTimeout(() => setToast(null), 6000)
    }
  }

  // ── add / harvest / delete ───────────────────────────────────────────────────

  const addEntry = async () => {
    setAddError(null)
    const { error } = await supabase.from('garden_entries').insert({
      user_id: USER_ID, crop_id: newCropId,
      planted_year: currentYear, season: currentSeason, day: currentDay,
      notes: newNotes || null, harvested: false,
    })
    if (error) setAddError(error.message)
    else { setAdding(false); setNewNotes(''); load() }
  }

  const markHarvested = async (entry: GardenEntry) => {
    await supabase.from('garden_entries')
      .update({ harvested: true, updated_at: new Date().toISOString() }).eq('id', entry.id)
    setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, harvested: true } : e))
  }

  const deleteEntry = async (id: string) => {
    await supabase.from('garden_entries').delete().eq('id', id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  // ── derived data ─────────────────────────────────────────────────────────────

  const seasonCrops = CROPS
    .filter((c) => c.seasons.includes(currentSeason) && c.type !== 'flower' && c.type !== 'grain')
    .map((c) => ({
      ...c,
      harvests: possibleHarvests(c, currentDay),
      gpd: profitPerDay(c, currentDay),
    }))
    .sort((a, b) => b.gpd - a.gpd)

  const plantable   = seasonCrops.filter((c) => c.harvests > 0)
  const tooLate     = seasonCrops.filter((c) => c.harvests === 0)
  const active      = entries.filter((e) => !e.harvested)
  const archived    = entries.filter((e) =>  e.harvested)
  const readyNow    = active.filter((e) => getHarvestInfo(e, currentYear, currentSeason, currentDay)?.ready).length
  const daysLeft    = 28 - currentDay
  const style       = SEASON_STYLE[currentSeason]

  return (
    <div className="p-4 md:p-8 max-w-3xl space-y-8">

      {/* ── Toast ────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-green text-cream rounded-2xl px-5 py-4 shadow-xl max-w-xs" style={{ boxShadow: 'var(--shadow-card-hover)' }}>
            <p className="font-semibold text-sm mb-1">🌾 Ready to harvest!</p>
            {toast.names.map((name) => <p key={name} className="text-sm opacity-90">· {name}</p>)}
            <button onClick={() => setToast(null)} className="mt-3 text-xs opacity-60 hover:opacity-100 transition-opacity">Dismiss</button>
          </div>
        </div>
      )}

      {/* ── Page title ───────────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-semibold text-ink">Garden Planner</h2>
        <p className="text-muted text-sm mt-1">Plan your season and track what's growing.</p>
      </div>

      {/* ── Planning card (date + what to plant, unified) ────────── */}
      <div className="bg-white border border-parchment rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>

        {/* Date controls */}
        <div className="p-5 flex flex-wrap gap-5 items-end border-b border-parchment">

          {/* Season */}
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted mb-2">Season</p>
            <div className="flex gap-1 bg-cream-dark rounded-xl p-1">
              {SEASONS.map((s) => (
                <button key={s} onClick={() => setSeason(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize font-medium transition-all ${currentSeason === s ? SEASON_STYLE[s].active : 'text-muted hover:bg-parchment/60'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Day slider */}
          <div className="flex-1 min-w-44">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] uppercase tracking-widest text-muted">Day</p>
              <span className={`text-xs font-semibold ${style.text}`}>{daysLeft} days left</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={28} value={currentDay}
                onChange={(e) => setDay(Number(e.target.value))}
                className="flex-1 accent-green h-1.5" />
              <span className={`text-xl font-bold w-8 text-center ${style.text}`}>{currentDay}</span>
            </div>
          </div>

          {/* Year */}
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted mb-2">Year</p>
            <input type="number" min={1} value={currentYear}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-16 border border-parchment rounded-xl px-3 py-1.5 text-sm text-center focus:outline-none focus:border-brown bg-cream font-medium" />
          </div>

          {/* Actions */}
          <div className="flex gap-2 ml-auto">
            <button onClick={saveSettings}
              className="text-sm text-muted border border-parchment hover:border-brown px-4 py-2 rounded-xl transition-colors">
              Save
            </button>
            <button onClick={advanceDay}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors ${style.active}`}>
              Next day →
            </button>
          </div>
        </div>

        {/* What to plant — directly below date controls */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-ink">
              What to plant this <span className={`capitalize ${style.text}`}>{currentSeason}</span>
            </p>
            <span className="text-xs text-muted">{plantable.length} viable crops</span>
          </div>

          {currentSeason === 'winter' ? (
            <div className="bg-cream-dark rounded-xl p-6 text-center">
              <p className="text-xl mb-1">❄️</p>
              <p className="text-muted text-sm">Nothing grows outdoors in Winter.</p>
            </div>
          ) : plantable.length === 0 ? (
            <div className="bg-cream-dark rounded-xl p-6 text-center">
              <p className="text-muted text-sm">Too late in the season to plant anything new.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {plantable.map((crop, i) => {
                const isTop = i < 2
                return (
                  <div key={crop.id}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${
                      isTop
                        ? `${style.soft} border-transparent ring-1 ${style.ring}`
                        : 'bg-cream-dark/50 border-transparent hover:bg-cream-dark'
                    }`}>

                    {/* Rank / best pick */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                      isTop ? style.active : 'bg-parchment text-muted'
                    }`}>
                      {i + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-ink text-sm">{crop.name}</p>
                        {isTop && <span className={`text-[10px] font-bold uppercase tracking-wide ${style.text}`}>Best pick</span>}
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        {crop.growDays}d grow{crop.regrowDays ? ` · ↺ ${crop.regrowDays}d` : ''}
                        {' · '}{crop.harvests} harvest{crop.harvests > 1 ? 's' : ''}
                        {' · '}ready day {Math.min(28, currentDay + crop.growDays)}
                      </p>
                    </div>

                    {/* Profit/day */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${isTop ? style.text : 'text-ink'}`}>~{crop.gpd}g/day</p>
                      <p className="text-xs text-muted">{crop.sellPrice}g sell</p>
                    </div>

                    <button onClick={() => { setNewCropId(crop.id); setAdding(true) }}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium flex-shrink-0 transition-colors ${
                        isTop ? style.active : 'bg-parchment text-muted hover:bg-brown-pale hover:text-ink'
                      }`}>
                      Plant
                    </button>
                  </div>
                )
              })}

              {/* Too late toggle */}
              {tooLate.length > 0 && (
                <button onClick={() => setShowAll((v) => !v)}
                  className="text-xs text-muted hover:text-ink transition-colors pt-1 pl-1">
                  {showAll ? '▲ Hide' : `▼ ${tooLate.length} crops won't make it this season`}
                </button>
              )}
              {showAll && tooLate.map((crop) => (
                <div key={crop.id} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-dashed border-parchment opacity-40">
                  <div className="w-8 h-8 rounded-lg bg-parchment flex items-center justify-center text-xs text-muted flex-shrink-0">✕</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{crop.name}</p>
                    <p className="text-xs text-muted">{crop.growDays}d — won't be ready before season ends</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add modal ────────────────────────────────────────────── */}
      {adding && (
        <div className="fixed inset-0 bg-ink/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm" style={{ boxShadow: 'var(--shadow-card-hover)' }}>
            <p className="text-base font-semibold text-ink mb-4">Log a new planting</p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-[11px] uppercase tracking-wide text-muted mb-1 block">Crop</label>
                <select value={newCropId} onChange={(e) => setNewCropId(e.target.value)}
                  className="w-full border border-parchment rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brown bg-cream">
                  {CROPS.filter((c) => c.seasons.includes(currentSeason)).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide text-muted mb-1 block">Notes (optional)</label>
                <input type="text" value={newNotes} onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. north field, row 2"
                  className="w-full border border-parchment rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brown bg-cream" />
              </div>
            </div>
            <p className="text-xs text-muted mb-4">
              Planting on{' '}
              <span className={`font-medium capitalize px-1.5 py-0.5 rounded ${style.soft} ${style.text}`}>
                {currentSeason} {currentDay}
              </span>
              , Year {currentYear}
            </p>
            {addError && <p className="text-xs text-fall bg-fall/10 rounded-lg px-3 py-2 mb-3">{addError}</p>}
            <div className="flex gap-3">
              <button onClick={addEntry} className={`${style.active} px-4 py-2 rounded-xl text-sm font-medium`}>Log planting</button>
              <button onClick={() => { setAdding(false); setAddError(null) }} className="text-muted text-sm hover:text-ink">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Your plants ──────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-ink">Your plants</h3>
            {readyNow > 0 && (
              <p className={`text-xs font-medium mt-0.5 ${style.text}`}>
                🌾 {readyNow} crop{readyNow > 1 ? 's' : ''} ready to harvest
              </p>
            )}
          </div>
          <button
            onClick={() => {
              const first = CROPS.find((c) => c.seasons.includes(currentSeason))
              if (first) setNewCropId(first.id)
              setAdding(true)
            }}
            className="text-xs text-muted hover:text-ink border border-parchment hover:border-brown rounded-lg px-3 py-1.5 transition-colors">
            + Log plant
          </button>
        </div>

        {loading ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : active.length === 0 && archived.length === 0 ? (
          <div className="bg-cream-dark rounded-2xl p-10 text-center">
            <p className="text-3xl mb-3">🌱</p>
            <p className="text-muted text-sm">Nothing logged yet.<br />Hit "Plant" on a crop above to start tracking.</p>
          </div>
        ) : (
          <div className="space-y-5">

            {/* Active */}
            {active.length > 0 && (
              <div className="space-y-2">
                {active.map((entry) => {
                  const crop = CROPS.find((c) => c.id === entry.crop_id)
                  const info = getHarvestInfo(entry, currentYear, currentSeason, currentDay)
                  const barColor = progressBarColor(info?.progress ?? 0, info?.ready ?? false)

                  return (
                    <div key={entry.id}
                      className={`bg-white border rounded-2xl px-5 py-4 transition-all ${
                        info?.ready ? 'border-green/40 bg-green-pale/20' : 'border-parchment hover:border-parchment'
                      }`}
                      style={{ boxShadow: 'var(--shadow-card)' }}>

                      <div className="flex items-center gap-4">
                        {/* Day counter */}
                        <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                          info?.ready ? 'bg-green' : info && info.progress >= 70 ? 'bg-spring/20' : info && info.progress >= 35 ? 'bg-summer/20' : 'bg-cream-dark'
                        }`}>
                          {info?.ready ? (
                            <span className="text-2xl">🌾</span>
                          ) : (
                            <>
                              <span className={`text-xl font-bold leading-none ${info && info.progress >= 70 ? 'text-spring' : info && info.progress >= 35 ? 'text-summer' : 'text-ink'}`}>
                                {info?.daysLeft}
                              </span>
                              <span className="text-[10px] text-muted leading-none mt-0.5">days</span>
                            </>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-ink">{crop?.name ?? entry.crop_id}</p>
                            {info?.ready
                              ? <span className="text-[11px] bg-green text-cream px-2 py-0.5 rounded-full font-medium">Ready!</span>
                              : info?.progress !== undefined && (
                                <span className="text-[11px] text-muted">{info.progress}%</span>
                              )}
                          </div>
                          <p className="text-xs text-muted">
                            {info?.ready
                              ? info.daysUntilNext ? `Regrows in ${info.daysUntilNext}d` : 'Ready to harvest'
                              : `Planted ${entry.season} ${entry.day}, Y${entry.planted_year}`}
                            {entry.notes && ` · ${entry.notes}`}
                          </p>

                          {/* Progress bar */}
                          <div className="h-1.5 w-full bg-cream-dark rounded-full overflow-hidden mt-2">
                            <div className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                              style={{ width: `${info?.progress ?? 0}%` }} />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {info?.ready && (
                            <button onClick={() => markHarvested(entry)}
                              className="text-xs bg-green hover:bg-green-light text-cream px-3 py-1.5 rounded-lg font-medium transition-colors">
                              Harvest
                            </button>
                          )}
                          <button onClick={() => deleteEntry(entry.id)}
                            className="text-muted hover:text-fall text-sm transition-colors">✕</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Archived */}
            {archived.length > 0 && (
              <div className="opacity-40">
                <p className="text-xs uppercase tracking-widest text-muted mb-2">Harvested · {archived.length}</p>
                <div className="space-y-1.5">
                  {archived.map((entry) => {
                    const crop = CROPS.find((c) => c.id === entry.crop_id)
                    return (
                      <div key={entry.id} className="bg-cream-dark rounded-xl px-4 py-2.5 flex items-center gap-3">
                        <p className="flex-1 text-sm font-medium text-ink line-through">{crop?.name ?? entry.crop_id}</p>
                        <span className="text-xs text-muted capitalize">{entry.season} {entry.day}</span>
                        <button onClick={() => deleteEntry(entry.id)} className="text-muted hover:text-fall text-sm">✕</button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  )
}

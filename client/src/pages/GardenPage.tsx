import { useEffect, useRef, useState } from 'react'
import { CROPS } from '@shared'
import type { Crop, GardenEntry, Season } from '@shared'
import { supabase, USER_ID } from '../api/supabase'
import { useAppStore } from '../store/useAppStore'

// ── helpers ───────────────────────────────────────────────────────────────────

const SEASON_INDEX: Record<Season, number> = { spring: 0, summer: 1, fall: 2, winter: 3 }
const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_STYLE: Record<Season, { active: string; badge: string; bar: string }> = {
  spring: { active: 'bg-spring text-white',  badge: 'bg-spring/10 text-spring',  bar: 'bg-spring' },
  summer: { active: 'bg-summer text-white',  badge: 'bg-summer/10 text-summer',  bar: 'bg-summer' },
  fall:   { active: 'bg-fall text-white',    badge: 'bg-fall/10 text-fall',      bar: 'bg-fall'   },
  winter: { active: 'bg-winter text-white',  badge: 'bg-winter/10 text-winter',  bar: 'bg-winter' },
}

function possibleHarvests(crop: Crop, currentDay: number): number {
  const daysLeft = 28 - currentDay
  if (daysLeft < crop.growDays) return 0
  if (!crop.regrowDays) return 1
  return 1 + Math.floor((daysLeft - crop.growDays) / crop.regrowDays)
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

// ── toast ─────────────────────────────────────────────────────────────────────

interface Toast { id: number; names: string[] }

// ── component ─────────────────────────────────────────────────────────────────

export default function GardenPage() {
  const { currentDay, currentSeason, currentYear, setDay, setSeason, setYear, saveSettings } = useAppStore()
  const [entries, setEntries]   = useState<GardenEntry[]>([])
  const [loading, setLoading]   = useState(true)
  const [adding, setAdding]     = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [newCropId, setNewCropId] = useState(CROPS[0].id)
  const [newNotes, setNewNotes]   = useState('')
  const [showAll, setShowAll]     = useState(false)
  const [toast, setToast]         = useState<Toast | null>(null)
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

  // ── actions ──────────────────────────────────────────────────────────────────

  const advanceDay = () => {
    const nextDay    = currentDay >= 28 ? 28 : currentDay + 1
    const nextSeason = currentDay >= 28 ? SEASONS[(SEASON_INDEX[currentSeason] + 1) % 4] : currentSeason
    const nextYear   = currentDay >= 28 && currentSeason === 'winter' ? currentYear + 1 : currentYear

    // Find plants that become ready on the next day
    const newlyReady = entries
      .filter((e) => !e.harvested)
      .filter((e) => {
        const wasBefore = getHarvestInfo(e, currentYear, currentSeason, currentDay)?.ready
        const willBe    = getHarvestInfo(e, nextYear, nextSeason, nextDay)?.ready
        return !wasBefore && willBe
      })
      .map((e) => CROPS.find((c) => c.id === e.crop_id)?.name ?? e.crop_id)

    setDay(nextDay)
    setSeason(nextSeason)
    setYear(nextYear)
    saveSettings()

    if (newlyReady.length > 0) {
      if (toastTimer.current) clearTimeout(toastTimer.current)
      setToast({ id: Date.now(), names: newlyReady })
      toastTimer.current = setTimeout(() => setToast(null), 6000)
    }
  }

  const addEntry = async () => {
    setAddError(null)
    const { error } = await supabase.from('garden_entries').insert({
      user_id: USER_ID, crop_id: newCropId,
      planted_year: currentYear, season: currentSeason, day: currentDay,
      notes: newNotes || null, harvested: false,
    })
    if (error) { setAddError(error.message) }
    else { setAdding(false); setNewNotes(''); load() }
  }

  const markHarvested = async (entry: GardenEntry) => {
    await supabase.from('garden_entries')
      .update({ harvested: true, updated_at: new Date().toISOString() })
      .eq('id', entry.id)
    setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, harvested: true } : e))
  }

  const deleteEntry = async (id: string) => {
    await supabase.from('garden_entries').delete().eq('id', id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  // ── derived ──────────────────────────────────────────────────────────────────

  const seasonCrops = CROPS
    .filter((c) => c.seasons.includes(currentSeason) && c.type !== 'flower' && c.type !== 'grain')
    .map((c) => ({ ...c, harvests: possibleHarvests(c, currentDay) }))
    .sort((a, b) => b.harvests - a.harvests || b.sellPrice - a.sellPrice)

  const plantable = seasonCrops.filter((c) => c.harvests > 0)
  const tooLate   = seasonCrops.filter((c) => c.harvests === 0)
  const active    = entries.filter((e) => !e.harvested)
  const archived  = entries.filter((e) =>  e.harvested)
  const readyNow  = active.filter((e) => getHarvestInfo(e, currentYear, currentSeason, currentDay)?.ready).length
  const style     = SEASON_STYLE[currentSeason]

  return (
    <div className="p-8 max-w-3xl space-y-10">

      {/* ── Toast notification ──────────────────────────────────── */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="bg-green text-cream rounded-2xl px-5 py-4 shadow-xl max-w-xs" style={{ boxShadow: 'var(--shadow-card-hover)' }}>
            <p className="font-semibold text-sm mb-1">🌾 Ready to harvest!</p>
            {toast.names.map((name) => (
              <p key={name} className="text-sm opacity-90">· {name}</p>
            ))}
            <button onClick={() => setToast(null)} className="mt-3 text-xs opacity-60 hover:opacity-100 transition-opacity">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ── Date selector ───────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-semibold text-ink mb-1">Garden Planner</h2>
        <p className="text-muted text-sm mb-5">Set your in-game date to see what's worth planting.</p>

        <div className="bg-white border border-parchment rounded-2xl p-5 flex flex-wrap gap-6 items-end" style={{ boxShadow: 'var(--shadow-card)' }}>

          <div>
            <label className="text-[11px] uppercase tracking-widest text-muted mb-2 block">Season</label>
            <div className="flex gap-1 bg-cream-dark rounded-xl p-1">
              {SEASONS.map((s) => (
                <button key={s} onClick={() => setSeason(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize font-medium transition-all ${currentSeason === s ? SEASON_STYLE[s].active : 'text-muted hover:bg-parchment/60'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-widest text-muted mb-2 block">Day</label>
            <div className="flex items-center gap-2">
              <input type="range" min={1} max={28} value={currentDay}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-32 accent-green" />
              <span className={`text-lg font-bold w-8 text-center ${style.badge.split(' ')[1]}`}>{currentDay}</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-widest text-muted mb-2 block">Year</label>
            <input type="number" min={1} value={currentYear}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-16 border border-parchment rounded-xl px-3 py-1.5 text-sm text-center focus:outline-none focus:border-brown bg-cream font-medium" />
          </div>

          <div className="ml-auto flex gap-2">
            <button onClick={() => saveSettings()}
              className="text-sm text-muted border border-parchment hover:border-brown px-4 py-2 rounded-xl transition-colors">
              Save
            </button>
            <button onClick={advanceDay}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors ${style.active}`}>
              Next day →
            </button>
          </div>
        </div>
      </section>

      {/* ── What to plant ───────────────────────────────────────── */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-ink">
              What to plant in <span className={`capitalize ${style.badge.split(' ')[1]}`}>{currentSeason}</span>
            </h3>
            <p className="text-xs text-muted mt-0.5">{28 - currentDay} days left in the season</p>
          </div>
          <span className="text-xs text-muted">{plantable.length} viable</span>
        </div>

        {currentSeason === 'winter' ? (
          <div className="bg-cream-dark rounded-2xl p-8 text-center">
            <p className="text-2xl mb-2">❄️</p>
            <p className="text-muted text-sm">Nothing grows outdoors in Winter.<br />Focus on the Mines or Greenhouse.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plantable.map((crop) => (
                <div key={crop.id}
                  className="bg-white border border-parchment hover:border-brown-pale rounded-2xl p-4 flex gap-4 items-start transition-all"
                  style={{ boxShadow: 'var(--shadow-card)' }}>
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex flex-col items-center justify-center ${style.badge}`}>
                    <span className="text-base font-bold leading-none">{crop.harvests}</span>
                    <span className="text-[9px] leading-none opacity-70">harvest{crop.harvests > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink text-sm">{crop.name}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {crop.growDays}d{crop.regrowDays ? ` · ↺ ${crop.regrowDays}d` : ''} · ready day {currentDay + crop.growDays}
                    </p>
                    <div className="flex gap-3 mt-2 text-xs">
                      <span className="text-ink font-medium">{crop.sellPrice}g</span>
                      {crop.kegValue && <span className="text-green font-medium">Keg {crop.kegValue}g</span>}
                      {!crop.kegValue && crop.jarValue && <span className="text-brown font-medium">Jar {crop.jarValue}g</span>}
                    </div>
                  </div>
                  <button onClick={() => { setNewCropId(crop.id); setAdding(true) }}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium flex-shrink-0 transition-colors ${style.active}`}>
                    Plant
                  </button>
                </div>
              ))}
            </div>

            {tooLate.length > 0 && (
              <div>
                <button onClick={() => setShowAll((v) => !v)}
                  className="text-xs text-muted hover:text-ink transition-colors mt-1 mb-2">
                  {showAll ? '▲ Hide' : `▼ ${tooLate.length} crops won't make it this season`}
                </button>
                {showAll && tooLate.map((crop) => (
                  <div key={crop.id} className="bg-cream-dark border border-parchment/50 rounded-2xl p-4 flex gap-4 items-center opacity-50 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-parchment flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-muted">✕</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink text-sm">{crop.name}</p>
                      <p className="text-xs text-muted">{crop.growDays}d — won't be ready before season ends</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Add form modal ──────────────────────────────────────── */}
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
              Planted on <span className={`font-medium capitalize px-1.5 py-0.5 rounded ${style.badge}`}>{currentSeason} {currentDay}</span>, Y{currentYear}
            </p>
            {addError && (
              <p className="text-xs text-fall bg-fall/10 rounded-lg px-3 py-2 mb-3">{addError}</p>
            )}
            <div className="flex gap-3">
              <button onClick={addEntry} className={`${style.active} px-4 py-2 rounded-xl text-sm font-medium`}>
                Log planting
              </button>
              <button onClick={() => { setAdding(false); setAddError(null) }} className="text-muted text-sm hover:text-ink">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Your plants ─────────────────────────────────────────── */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-base font-semibold text-ink">Your plants</h3>
          <div className="flex items-center gap-3">
            {readyNow > 0 && (
              <span className="text-xs bg-green text-cream px-2.5 py-1 rounded-full font-medium">
                {readyNow} ready to harvest!
              </span>
            )}
            <button
              onClick={() => {
                const first = CROPS.find((c) => c.seasons.includes(currentSeason))
                if (first) setNewCropId(first.id)
                setAdding(true)
              }}
              className="text-xs text-muted hover:text-ink border border-parchment hover:border-brown rounded-lg px-3 py-1 transition-colors">
              + Log plant
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : active.length === 0 && archived.length === 0 ? (
          <div className="bg-cream-dark rounded-2xl p-8 text-center">
            <p className="text-3xl mb-3">🌱</p>
            <p className="text-muted text-sm">Nothing logged yet. Hit "Plant" on a crop above.</p>
          </div>
        ) : (
          <div className="space-y-5">

            {active.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted">Growing · {active.length}</p>
                {active.map((entry) => {
                  const crop = CROPS.find((c) => c.id === entry.crop_id)
                  const info = getHarvestInfo(entry, currentYear, currentSeason, currentDay)

                  return (
                    <div key={entry.id}
                      className={`bg-white border rounded-2xl px-5 py-4 transition-all ${info?.ready ? 'border-green bg-green-pale/20' : 'border-parchment hover:border-brown-pale'}`}
                      style={{ boxShadow: 'var(--shadow-card)' }}>

                      <div className="flex items-center gap-4 mb-3">
                        {/* Days remaining / ready badge */}
                        {info?.ready ? (
                          <div className="w-14 h-14 rounded-xl bg-green flex flex-col items-center justify-center flex-shrink-0">
                            <span className="text-lg">🌾</span>
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-cream-dark flex flex-col items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-ink leading-none">{info?.daysLeft}</span>
                            <span className="text-[10px] text-muted leading-none mt-0.5">day{info?.daysLeft !== 1 ? 's' : ''}</span>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-ink">{crop?.name ?? entry.crop_id}</p>
                          <p className="text-xs text-muted mt-0.5">
                            {info?.ready
                              ? info.daysUntilNext ? `Regrows in ${info.daysUntilNext}d` : 'Ready to harvest'
                              : `Planted ${entry.season} ${entry.day}, Y${entry.planted_year}`}
                          </p>
                          {entry.notes && <p className="text-xs text-muted italic mt-0.5">{entry.notes}</p>}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {info?.ready && (
                            <button onClick={() => markHarvested(entry)}
                              className="text-xs bg-green text-cream px-3 py-1.5 rounded-lg font-medium hover:bg-green-light transition-colors">
                              Harvest
                            </button>
                          )}
                          <button onClick={() => deleteEntry(entry.id)} className="text-muted hover:text-fall text-sm transition-colors">✕</button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 w-full bg-cream-dark rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${info?.ready ? 'bg-green' : style.bar}`}
                          style={{ width: `${info?.progress ?? 0}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {archived.length > 0 && (
              <div className="space-y-2 opacity-40">
                <p className="text-xs uppercase tracking-widest text-muted">Harvested · {archived.length}</p>
                {archived.map((entry) => {
                  const crop = CROPS.find((c) => c.id === entry.crop_id)
                  return (
                    <div key={entry.id} className="bg-white border border-parchment rounded-2xl px-5 py-3 flex items-center gap-3">
                      <p className="flex-1 text-sm font-medium text-ink line-through">{crop?.name ?? entry.crop_id}</p>
                      <button onClick={() => deleteEntry(entry.id)} className="text-muted hover:text-fall text-sm">✕</button>
                    </div>
                  )
                })}
              </div>
            )}

          </div>
        )}
      </section>

    </div>
  )
}

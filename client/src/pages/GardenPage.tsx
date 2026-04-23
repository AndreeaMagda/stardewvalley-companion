import { useEffect, useState } from 'react'
import { CROPS } from '@shared'
import type { GardenEntry, Season } from '@shared'
import { supabase, USER_ID } from '../api/supabase'
import { useAppStore } from '../store/useAppStore'

const SEASON_COLOR: Record<Season, string> = {
  spring: 'text-spring bg-spring/10',
  summer: 'text-summer bg-summer/10',
  fall:   'text-fall bg-fall/10',
  winter: 'text-winter bg-winter/10',
}

export default function GardenPage() {
  const { currentDay, currentSeason, currentYear } = useAppStore()
  const [entries, setEntries] = useState<GardenEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newCropId, setNewCropId] = useState(CROPS[0].id)
  const [newNotes, setNewNotes] = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('garden_entries')
      .select('*')
      .eq('user_id', USER_ID)
      .order('created_at', { ascending: false })
    setEntries((data as GardenEntry[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const addEntry = async () => {
    const { error } = await supabase.from('garden_entries').insert({
      user_id: USER_ID,
      crop_id: newCropId,
      season: currentSeason,
      day: currentDay,
      notes: newNotes || null,
      harvested: false,
    })
    if (!error) { setAdding(false); setNewNotes(''); load() }
  }

  const toggleHarvested = async (entry: GardenEntry) => {
    await supabase
      .from('garden_entries')
      .update({ harvested: !entry.harvested, updated_at: new Date().toISOString() })
      .eq('id', entry.id)
    setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, harvested: !e.harvested } : e))
  }

  const deleteEntry = async (id: string) => {
    await supabase.from('garden_entries').delete().eq('id', id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const getCrop = (id: string) => CROPS.find((c) => c.id === id)

  const active = entries.filter((e) => !e.harvested)
  const done   = entries.filter((e) => e.harvested)

  return (
    <div className="p-8 max-w-2xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Garden</h2>
          <p className="text-muted text-sm mt-1">Track what's growing on your farm.</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="bg-green hover:bg-green-light text-cream text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          + Plant
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-white border border-parchment rounded-2xl p-5 mb-6" style={{ boxShadow: 'var(--shadow-card)' }}>
          <p className="text-sm font-semibold text-ink mb-4">New entry</p>

          <div className="space-y-3 mb-4">
            <div>
              <label className="text-[11px] uppercase tracking-wide text-muted mb-1 block">Crop</label>
              <select
                value={newCropId}
                onChange={(e) => setNewCropId(e.target.value)}
                className="w-full border border-parchment rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brown bg-cream"
              >
                {CROPS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide text-muted mb-1 block">Notes (optional)</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="e.g. north field, row 2"
                className="w-full border border-parchment rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brown bg-cream"
              />
            </div>
          </div>

          <p className="text-xs text-muted mb-4">
            Planting on{' '}
            <span className={`font-medium capitalize px-1.5 py-0.5 rounded ${SEASON_COLOR[currentSeason]}`}>
              {currentSeason} {currentDay}
            </span>
            , Year {currentYear}
          </p>

          <div className="flex gap-3">
            <button onClick={addEntry} className="bg-green hover:bg-green-light text-cream px-4 py-1.5 rounded-xl text-sm font-medium transition-colors">
              Add entry
            </button>
            <button onClick={() => setAdding(false)} className="text-muted text-sm hover:text-ink transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : entries.length === 0 ? (
        <div className="bg-cream-dark rounded-2xl p-10 text-center">
          <p className="text-3xl mb-3">🌱</p>
          <p className="text-muted text-sm">Nothing planted yet.<br/>Hit the button above to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Active crops */}
          {active.length > 0 && (
            <section>
              <p className="text-xs uppercase tracking-widest text-muted mb-3">Growing · {active.length}</p>
              <div className="space-y-2">
                {active.map((entry) => {
                  const crop = getCrop(entry.crop_id)
                  return (
                    <div key={entry.id} className="bg-white border border-parchment hover:border-brown-pale rounded-2xl px-5 py-4 flex items-center gap-4 transition-all" style={{ boxShadow: 'var(--shadow-card)' }}>
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => toggleHarvested(entry)}
                        className="w-4 h-4 accent-green cursor-pointer flex-shrink-0 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-ink text-sm">{crop?.name ?? entry.crop_id}</p>
                        {entry.notes && <p className="text-xs text-muted mt-0.5">{entry.notes}</p>}
                      </div>
                      <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded-lg ${SEASON_COLOR[entry.season]}`}>
                        {entry.season} {entry.day}
                      </span>
                      <button onClick={() => deleteEntry(entry.id)} className="text-muted hover:text-fall text-sm transition-colors ml-1">✕</button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Harvested */}
          {done.length > 0 && (
            <section>
              <p className="text-xs uppercase tracking-widest text-muted mb-3">Harvested · {done.length}</p>
              <div className="space-y-2 opacity-50">
                {done.map((entry) => {
                  const crop = getCrop(entry.crop_id)
                  return (
                    <div key={entry.id} className="bg-white border border-parchment rounded-2xl px-5 py-4 flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => toggleHarvested(entry)}
                        className="w-4 h-4 accent-green cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-ink text-sm line-through">{crop?.name ?? entry.crop_id}</p>
                        {entry.notes && <p className="text-xs text-muted mt-0.5">{entry.notes}</p>}
                      </div>
                      <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded-lg ${SEASON_COLOR[entry.season]}`}>
                        {entry.season} {entry.day}
                      </span>
                      <button onClick={() => deleteEntry(entry.id)} className="text-muted hover:text-fall text-sm transition-colors ml-1">✕</button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  )
}

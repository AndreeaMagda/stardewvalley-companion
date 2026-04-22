import { useEffect, useState } from 'react'
import { CROPS } from '@shared'
import type { GardenEntry, Season } from '@shared'
import { supabase, USER_ID } from '../api/supabase'
import { useAppStore } from '../store/useAppStore'

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
    if (!error) {
      setAdding(false)
      setNewNotes('')
      load()
    }
  }

  const toggleHarvested = async (entry: GardenEntry) => {
    await supabase
      .from('garden_entries')
      .update({ harvested: !entry.harvested, updated_at: new Date().toISOString() })
      .eq('id', entry.id)
    setEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, harvested: !e.harvested } : e))
    )
  }

  const deleteEntry = async (id: string) => {
    await supabase.from('garden_entries').delete().eq('id', id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const getCropName = (id: string) => CROPS.find((c) => c.id === id)?.name ?? id

  const SEASON_COLORS: Record<Season, string> = {
    spring: 'text-spring', summer: 'text-summer', fall: 'text-fall', winter: 'text-winter',
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-ink mb-1">Garden</h2>
          <p className="text-muted text-sm">Track what you've planted this season.</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="bg-green text-cream px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-light transition-colors"
        >
          + Plant crop
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-white border border-parchment rounded-xl p-5 mb-6 shadow-sm">
          <h3 className="font-medium text-ink mb-4">New entry</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted mb-1 block">Crop</label>
              <select
                value={newCropId}
                onChange={(e) => setNewCropId(e.target.value)}
                className="w-full border border-parchment rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brown"
              >
                {CROPS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Notes (optional)</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="e.g. north field, row 2"
                className="w-full border border-parchment rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brown"
              />
            </div>
          </div>
          <p className="text-xs text-muted mb-4">
            Planting on <span className={`font-medium capitalize ${SEASON_COLORS[currentSeason]}`}>{currentSeason} {currentDay}</span>, Year {currentYear}
          </p>
          <div className="flex gap-3">
            <button onClick={addEntry} className="bg-green text-cream px-4 py-1.5 rounded-lg text-sm hover:bg-green-light transition-colors">
              Add
            </button>
            <button onClick={() => setAdding(false)} className="text-muted text-sm hover:text-ink">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : entries.length === 0 ? (
        <div className="bg-cream-dark rounded-xl p-8 text-center text-muted">
          <p className="text-2xl mb-2">🌱</p>
          <p>No crops planted yet. Add your first entry above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 bg-white border rounded-xl px-5 py-3 transition-all ${
                entry.harvested ? 'opacity-50 border-parchment' : 'border-parchment hover:border-brown-light'
              }`}
            >
              <input
                type="checkbox"
                checked={entry.harvested}
                onChange={() => toggleHarvested(entry)}
                className="w-4 h-4 accent-green cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <span className={`font-medium text-ink ${entry.harvested ? 'line-through' : ''}`}>
                  {getCropName(entry.crop_id)}
                </span>
                {entry.notes && (
                  <span className="ml-2 text-xs text-muted">{entry.notes}</span>
                )}
              </div>
              <span className={`text-xs capitalize font-medium ${SEASON_COLORS[entry.season]}`}>
                {entry.season} {entry.day}
              </span>
              <button
                onClick={() => deleteEntry(entry.id)}
                className="text-muted hover:text-fall text-xs transition-colors ml-2"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

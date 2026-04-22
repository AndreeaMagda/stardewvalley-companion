import { useEffect, useState } from 'react'
import type { Resource } from '@shared'
import { supabase, USER_ID } from '../api/supabase'

const DEFAULT_RESOURCES = [
  'Wood', 'Stone', 'Coal', 'Iron Ore', 'Gold Ore', 'Iridium Ore',
  'Fiber', 'Sap', 'Mixed Seeds', 'Hardwood', 'Bait', 'Bomb',
]

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('resources')
      .select('*')
      .eq('user_id', USER_ID)
      .order('type')
    const existing = (data as Resource[]) ?? []

    // Fill in defaults for any types not yet in DB
    const existingTypes = new Set(existing.map((r) => r.type))
    const missing = DEFAULT_RESOURCES.filter((t) => !existingTypes.has(t))

    if (missing.length > 0) {
      const { data: inserted } = await supabase.from('resources').upsert(
        missing.map((type) => ({ user_id: USER_ID, type, quantity: 0 })),
        { onConflict: 'user_id,type' }
      ).select()
      setResources([...existing, ...((inserted as Resource[]) ?? [])])
    } else {
      setResources(existing)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateQty = async (resource: Resource, delta: number) => {
    const newQty = Math.max(0, resource.quantity + delta)
    await supabase
      .from('resources')
      .update({ quantity: newQty, updated_at: new Date().toISOString() })
      .eq('id', resource.id)
    setResources((prev) =>
      prev.map((r) => (r.id === resource.id ? { ...r, quantity: newQty } : r))
    )
  }

  const setQty = async (resource: Resource, value: number) => {
    const newQty = Math.max(0, value)
    await supabase
      .from('resources')
      .update({ quantity: newQty, updated_at: new Date().toISOString() })
      .eq('id', resource.id)
    setResources((prev) =>
      prev.map((r) => (r.id === resource.id ? { ...r, quantity: newQty } : r))
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <h2 className="text-2xl font-semibold text-ink mb-1">Resources</h2>
      <p className="text-muted text-sm mb-6">Track your materials inventory.</p>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {resources.map((r) => (
            <div key={r.id} className="bg-white border border-parchment rounded-xl px-5 py-4 flex items-center gap-4 hover:border-brown-light transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink text-sm">{r.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(r, -10)}
                  className="w-7 h-7 rounded bg-cream-dark text-muted hover:bg-parchment text-xs font-bold transition-colors"
                  title="-10"
                >
                  ‹‹
                </button>
                <button
                  onClick={() => updateQty(r, -1)}
                  className="w-7 h-7 rounded bg-cream-dark text-muted hover:bg-parchment text-base font-bold transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  value={r.quantity}
                  onChange={(e) => setQty(r, Number(e.target.value))}
                  className="w-14 text-center text-ink font-semibold text-sm border border-parchment rounded px-1 py-0.5 focus:outline-none focus:border-brown"
                />
                <button
                  onClick={() => updateQty(r, 1)}
                  className="w-7 h-7 rounded bg-cream-dark text-muted hover:bg-parchment text-base font-bold transition-colors"
                >
                  +
                </button>
                <button
                  onClick={() => updateQty(r, 10)}
                  className="w-7 h-7 rounded bg-cream-dark text-muted hover:bg-parchment text-xs font-bold transition-colors"
                  title="+10"
                >
                  ››
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

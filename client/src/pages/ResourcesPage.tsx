import { useEffect, useState } from 'react'
import type { Resource } from '@shared'
import { supabase, USER_ID } from '../api/supabase'

const RESOURCE_GROUPS: { label: string; icon: string; items: string[] }[] = [
  {
    label: 'Basic Materials',
    icon: '🪵',
    items: ['Wood', 'Stone', 'Fiber', 'Sap', 'Hardwood'],
  },
  {
    label: 'Ores & Bars',
    icon: '⛏️',
    items: ['Coal', 'Copper Ore', 'Iron Ore', 'Gold Ore', 'Iridium Ore'],
  },
  {
    label: 'Farming',
    icon: '🌱',
    items: ['Mixed Seeds', 'Basic Fertilizer', 'Quality Fertilizer', 'Speed-Gro'],
  },
  {
    label: 'Fishing & Combat',
    icon: '🎣',
    items: ['Bait', 'Bomb', 'Cherry Bomb', 'Mega Bomb'],
  },
]

const ALL_DEFAULT = RESOURCE_GROUPS.flatMap((g) => g.items)

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('resources')
      .select('*')
      .eq('user_id', USER_ID)
    const existing = (data as Resource[]) ?? []
    const existingTypes = new Set(existing.map((r) => r.type))
    const missing = ALL_DEFAULT.filter((t) => !existingTypes.has(t))

    if (missing.length > 0) {
      const { data: inserted } = await supabase
        .from('resources')
        .upsert(missing.map((type) => ({ user_id: USER_ID, type, quantity: 0 })), { onConflict: 'user_id,type' })
        .select()
      setResources([...existing, ...((inserted as Resource[]) ?? [])])
    } else {
      setResources(existing)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const getQty = (type: string) => resources.find((r) => r.type === type)?.quantity ?? 0

  const updateQty = async (type: string, delta: number) => {
    const resource = resources.find((r) => r.type === type)
    if (!resource) return
    const newQty = Math.max(0, resource.quantity + delta)
    await supabase
      .from('resources')
      .update({ quantity: newQty, updated_at: new Date().toISOString() })
      .eq('id', resource.id)
    setResources((prev) => prev.map((r) => r.type === type ? { ...r, quantity: newQty } : r))
  }

  const setQty = async (type: string, value: number) => {
    const resource = resources.find((r) => r.type === type)
    if (!resource) return
    const newQty = Math.max(0, value)
    await supabase
      .from('resources')
      .update({ quantity: newQty, updated_at: new Date().toISOString() })
      .eq('id', resource.id)
    setResources((prev) => prev.map((r) => r.type === type ? { ...r, quantity: newQty } : r))
  }

  return (
    <div className="p-8 max-w-3xl">
      <h2 className="text-2xl font-semibold text-ink mb-1">Resources</h2>
      <p className="text-muted text-sm mt-1 mb-7">Keep track of your materials inventory.</p>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : (
        <div className="space-y-8">
          {RESOURCE_GROUPS.map((group) => (
            <section key={group.label}>
              <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted mb-3">
                <span>{group.icon}</span> {group.label}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {group.items.map((type) => {
                  const qty = getQty(type)
                  return (
                    <div
                      key={type}
                      className="bg-white border border-parchment rounded-2xl px-5 py-4 flex items-center gap-3 hover:border-brown-pale transition-all"
                      style={{ boxShadow: 'var(--shadow-card)' }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink">{type}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQty(type, -1)}
                          className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-parchment text-ink text-base font-bold transition-colors flex items-center justify-center"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={qty}
                          onChange={(e) => setQty(type, Number(e.target.value))}
                          className="w-12 text-center text-ink font-semibold text-sm border border-parchment rounded-lg py-0.5 focus:outline-none focus:border-brown bg-cream"
                        />
                        <button
                          onClick={() => updateQty(type, 1)}
                          className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-parchment text-ink text-base font-bold transition-colors flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

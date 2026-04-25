import { useEffect, useState } from 'react'
import type { Resource } from '@shared'
import { supabase } from '../api/supabase'
import { useUserId } from '../hooks/useUserId'

const RESOURCE_GROUPS: { label: string; icon: string; items: { name: string; hint: string }[] }[] = [
  {
    label: 'Basic Materials', icon: '🪵',
    items: [
      { name: 'Wood',      hint: 'Chop trees on your farm' },
      { name: 'Stone',     hint: 'Mine rocks and the Mines' },
      { name: 'Fiber',     hint: 'Cut weeds with a scythe' },
      { name: 'Sap',       hint: 'Drops when chopping trees' },
      { name: 'Hardwood',  hint: 'Large stumps, Secret Woods' },
    ],
  },
  {
    label: 'Ores & Bars', icon: '⛏️',
    items: [
      { name: 'Coal',       hint: 'Mines floors 40–80' },
      { name: 'Copper Ore', hint: 'Mines floors 1–39' },
      { name: 'Iron Ore',   hint: 'Mines floors 40–79' },
      { name: 'Gold Ore',   hint: 'Mines floors 80+' },
      { name: 'Iridium Ore',hint: 'Skull Cavern' },
    ],
  },
  {
    label: 'Farming Supplies', icon: '🌱',
    items: [
      { name: 'Mixed Seeds',        hint: 'Dropped by weeds' },
      { name: 'Basic Fertilizer',   hint: 'Crafted from Sap ×2' },
      { name: 'Quality Fertilizer', hint: 'Crafted from Sap ×4 + Fish' },
      { name: 'Speed-Gro',          hint: 'Spring Foraging Bundle reward' },
    ],
  },
  {
    label: 'Combat & Fishing', icon: '⚔️',
    items: [
      { name: 'Bait',        hint: 'Crafted from Bug Meat' },
      { name: 'Bomb',        hint: 'Crafted from Iron Ore ×4 + Coal ×1' },
      { name: 'Cherry Bomb', hint: 'Crafted from Copper Ore ×4 + Coal ×1' },
      { name: 'Mega Bomb',   hint: 'Crafted from Gold Ore ×4 + Frozen Tear ×1 + Fire Quartz ×1' },
    ],
  },
]

const ALL_ITEMS = RESOURCE_GROUPS.flatMap((g) => g.items.map((i) => i.name))

export default function ResourcesPage() {
  const userId = useUserId()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading]     = useState(true)
  const [resetting, setResetting] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('resources').select('*').eq('user_id', userId)
    const existing     = (data as Resource[]) ?? []
    const existingTypes = new Set(existing.map((r) => r.type))
    const missing       = ALL_ITEMS.filter((t) => !existingTypes.has(t))
    if (missing.length > 0) {
      const { data: inserted } = await supabase
        .from('resources')
        .upsert(missing.map((type) => ({ user_id: userId, type, quantity: 0 })), { onConflict: 'user_id,type' })
        .select()
      setResources([...existing, ...((inserted as Resource[]) ?? [])])
    } else {
      setResources(existing)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const getResource = (name: string) => resources.find((r) => r.type === name)

  const updateQty = async (name: string, delta: number) => {
    const r = getResource(name)
    if (!r) return
    const newQty = Math.max(0, r.quantity + delta)
    await supabase.from('resources').update({ quantity: newQty, updated_at: new Date().toISOString() }).eq('id', r.id)
    setResources((prev) => prev.map((x) => x.type === name ? { ...x, quantity: newQty } : x))
  }

  const setQty = async (name: string, value: number) => {
    const r = getResource(name)
    if (!r) return
    const newQty = Math.max(0, value)
    await supabase.from('resources').update({ quantity: newQty, updated_at: new Date().toISOString() }).eq('id', r.id)
    setResources((prev) => prev.map((x) => x.type === name ? { ...x, quantity: newQty } : x))
  }

  const resetAll = async () => {
    setResetting(true)
    await Promise.all(
      resources.map((r) =>
        supabase.from('resources').update({ quantity: 0, updated_at: new Date().toISOString() }).eq('id', r.id)
      )
    )
    setResources((prev) => prev.map((r) => ({ ...r, quantity: 0 })))
    setResetting(false)
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-7">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Resources</h2>
          <p className="text-muted text-sm mt-1">Track your materials inventory.</p>
        </div>
        <button onClick={resetAll} disabled={resetting}
          className="text-xs text-muted hover:text-fall border border-parchment hover:border-fall/40 px-3 py-1.5 rounded-lg transition-colors">
          {resetting ? 'Resetting…' : 'Reset all'}
        </button>
      </div>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : (
        <div className="space-y-8">
          {RESOURCE_GROUPS.map((group) => (
            <section key={group.label}>
              <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted mb-3">
                <span>{group.icon}</span>{group.label}
              </p>
              <div className="space-y-2">
                {group.items.map(({ name, hint }) => {
                  const qty = getResource(name)?.quantity ?? 0
                  return (
                    <div key={name}
                      className="bg-white border border-parchment rounded-2xl px-5 py-3.5 flex items-center gap-4 hover:border-brown-pale transition-all"
                      style={{ boxShadow: 'var(--shadow-card)' }}>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink">{name}</p>
                        <p className="text-xs text-muted mt-0.5">{hint}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(name, -10)}
                          className="w-8 h-8 rounded-lg bg-cream-dark hover:bg-parchment text-muted text-xs font-bold transition-colors flex items-center justify-center">
                          ‹‹
                        </button>
                        <button onClick={() => updateQty(name, -1)}
                          className="w-8 h-8 rounded-lg bg-cream-dark hover:bg-parchment text-ink text-lg font-bold transition-colors flex items-center justify-center leading-none">
                          −
                        </button>
                        <input type="number" min={0} value={qty}
                          onChange={(e) => setQty(name, Number(e.target.value))}
                          className="w-16 text-center text-ink font-bold text-sm border border-parchment rounded-lg py-1.5 focus:outline-none focus:border-brown bg-cream" />
                        <button onClick={() => updateQty(name, 1)}
                          className="w-8 h-8 rounded-lg bg-cream-dark hover:bg-parchment text-ink text-lg font-bold transition-colors flex items-center justify-center leading-none">
                          +
                        </button>
                        <button onClick={() => updateQty(name, 10)}
                          className="w-8 h-8 rounded-lg bg-cream-dark hover:bg-parchment text-muted text-xs font-bold transition-colors flex items-center justify-center">
                          ››
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

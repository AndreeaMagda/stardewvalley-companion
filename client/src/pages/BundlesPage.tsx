import { useEffect, useState } from 'react'
import { BUNDLE_ROOMS } from '@shared'
import type { BundleRoom } from '@shared'
import { supabase, USER_ID } from '../api/supabase'

type CompletedMap = Record<string, boolean> // key: `bundleId-itemId`

const ROOM_COLORS: Record<string, { ring: string; bar: string; done: string; bg: string }> = {
  'pantry':        { ring: 'border-spring/40',  bar: 'bg-spring',  done: 'bg-spring/10 text-spring',   bg: 'bg-spring/5'  },
  'crafts-room':   { ring: 'border-green/40',   bar: 'bg-green',   done: 'bg-green/10 text-green',     bg: 'bg-green/5'   },
  'fish-tank':     { ring: 'border-winter/40',  bar: 'bg-winter',  done: 'bg-winter/10 text-winter',   bg: 'bg-winter/5'  },
  'boiler-room':   { ring: 'border-fall/40',    bar: 'bg-fall',    done: 'bg-fall/10 text-fall',       bg: 'bg-fall/5'    },
  'bulletin-board':{ ring: 'border-summer/40',  bar: 'bg-summer',  done: 'bg-summer/10 text-summer',   bg: 'bg-summer/5'  },
  'vault':         { ring: 'border-brown/40',   bar: 'bg-brown',   done: 'bg-brown/10 text-brown',     bg: 'bg-brown/5'   },
}

function roomProgress(room: BundleRoom, completed: CompletedMap) {
  let total = 0, done = 0
  for (const bundle of room.bundles) {
    const needed = bundle.required ?? bundle.items.length
    const completedCount = bundle.items.filter((item) => completed[`${bundle.id}-${item.id}`]).length
    total += needed
    done  += Math.min(completedCount, needed)
  }
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 }
}

function bundleProgress(bundle: BundleRoom['bundles'][number], completed: CompletedMap) {
  const needed       = bundle.required ?? bundle.items.length
  const completedCount = bundle.items.filter((item) => completed[`${bundle.id}-${item.id}`]).length
  return { needed, completedCount, done: completedCount >= needed }
}

export default function BundlesPage() {
  const [completed, setCompleted] = useState<CompletedMap>({})
  const [loading, setLoading]     = useState(true)
  const [openRoom, setOpenRoom]   = useState<string>(BUNDLE_ROOMS[0].id)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('bundle_items')
      .select('bundle_id, item_id, completed')
      .eq('user_id', USER_ID)
    const map: CompletedMap = {}
    for (const row of (data ?? []) as { bundle_id: string; item_id: string; completed: boolean }[]) {
      map[`${row.bundle_id}-${row.item_id}`] = row.completed
    }
    setCompleted(map)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggle = async (bundleId: string, itemId: string) => {
    const key     = `${bundleId}-${itemId}`
    const current = completed[key] ?? false
    setCompleted((prev) => ({ ...prev, [key]: !current }))
    await supabase.from('bundle_items').upsert(
      { user_id: USER_ID, bundle_id: bundleId, item_id: itemId, completed: !current },
      { onConflict: 'user_id,bundle_id,item_id' }
    )
  }

  // Overall progress
  const allItems  = BUNDLE_ROOMS.flatMap((r) => r.bundles.flatMap((b) => b.items.map((i) => `${b.id}-${i.id}`)))
  const totalDone = allItems.filter((k) => completed[k]).length
  const totalPct  = allItems.length ? Math.round((totalDone / allItems.length) * 100) : 0

  return (
    <div className="p-4 md:p-8 max-w-3xl">

      {/* Header */}
      <div className="mb-7">
        <h2 className="text-2xl font-semibold text-ink">Community Center</h2>
        <p className="text-muted text-sm mt-1">Track your bundle progress room by room.</p>
      </div>

      {/* Overall progress */}
      <div className="bg-white border border-parchment rounded-2xl p-5 mb-8" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-ink">Overall progress</span>
          <span className="text-sm font-bold text-ink">{totalDone} / {allItems.length} items</span>
        </div>
        <div className="h-3 w-full bg-cream-dark rounded-full overflow-hidden">
          <div className="h-full bg-green rounded-full transition-all duration-500" style={{ width: `${totalPct}%` }} />
        </div>
        <p className="text-xs text-muted mt-2">{totalPct}% complete</p>
      </div>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : (
        <div className="space-y-3">
          {BUNDLE_ROOMS.map((room) => {
            const color = ROOM_COLORS[room.id]
            const { total, done, pct } = roomProgress(room, completed)
            const isOpen  = openRoom === room.id
            const isComplete = done === total

            return (
              <div key={room.id} className={`bg-white border rounded-2xl overflow-hidden transition-all ${isOpen ? color.ring : 'border-parchment'}`}
                style={{ boxShadow: 'var(--shadow-card)' }}>

                {/* Room header */}
                <button
                  onClick={() => setOpenRoom(isOpen ? '' : room.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-cream/50 transition-colors text-left"
                >
                  <span className="text-2xl">{room.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-ink">{room.name}</p>
                      {isComplete && (
                        <span className="text-[11px] bg-green text-cream px-2 py-0.5 rounded-full font-medium">Complete!</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-cream-dark rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${color.bar}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-muted flex-shrink-0">{done}/{total}</span>
                    </div>
                  </div>
                  <span className="text-muted text-sm">{isOpen ? '▲' : '▼'}</span>
                </button>

                {/* Bundles */}
                {isOpen && (
                  <div className={`px-5 pb-5 pt-1 ${color.bg} border-t border-parchment/50`}>
                    <div className="space-y-4 mt-3">
                      {room.bundles.map((bundle) => {
                        const bp = bundleProgress(bundle, completed)
                        return (
                          <div key={bundle.id}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-ink">{bundle.name} Bundle</p>
                                {bp.done && (
                                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${color.done}`}>Done</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted">
                                {bundle.required && (
                                  <span className="italic">pick {bundle.required}</span>
                                )}
                                <span className="text-green font-medium">→ {bundle.reward}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {bundle.items.map((item) => {
                                const key  = `${bundle.id}-${item.id}`
                                const done = completed[key] ?? false
                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => toggle(bundle.id, item.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                                      done
                                        ? `${color.done} border-transparent line-through opacity-60`
                                        : 'bg-white border-parchment text-ink hover:border-brown-light'
                                    }`}
                                  >
                                    {done ? '✓' : '○'}
                                    {item.name}
                                    {item.quantity && <span className="opacity-70">×{item.quantity}</span>}
                                    {item.quality  && <span className="opacity-70">({item.quality})</span>}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

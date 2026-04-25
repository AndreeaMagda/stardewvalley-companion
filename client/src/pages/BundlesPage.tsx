import { useEffect, useState } from 'react'
import { BUNDLE_ROOMS } from '@shared'
import type { BundleRoom } from '@shared'
import { supabase } from '../api/supabase'
import { useUserId } from '../hooks/useUserId'

type CompletedMap = Record<string, boolean>

const ROOM_COLORS: Record<string, { border: string; bar: string; tag: string; bg: string; check: string }> = {
  'pantry':         { border: 'border-spring/40',  bar: 'bg-spring',  tag: 'bg-spring/15 text-spring',   bg: 'bg-spring/5',  check: 'bg-spring text-white' },
  'crafts-room':    { border: 'border-green/40',   bar: 'bg-green',   tag: 'bg-green/15 text-green',     bg: 'bg-green/5',   check: 'bg-green text-white' },
  'fish-tank':      { border: 'border-winter/40',  bar: 'bg-winter',  tag: 'bg-winter/15 text-winter',   bg: 'bg-winter/5',  check: 'bg-winter text-white' },
  'boiler-room':    { border: 'border-fall/40',    bar: 'bg-fall',    tag: 'bg-fall/15 text-fall',       bg: 'bg-fall/5',    check: 'bg-fall text-white' },
  'bulletin-board': { border: 'border-summer/40',  bar: 'bg-summer',  tag: 'bg-summer/15 text-summer',   bg: 'bg-summer/5',  check: 'bg-summer text-white' },
  'vault':          { border: 'border-brown/40',   bar: 'bg-brown',   tag: 'bg-brown/15 text-brown',     bg: 'bg-brown/5',   check: 'bg-brown text-white' },
}

const QUALITY_STYLE: Record<string, string> = {
  silver:  'text-[#a0aec0] font-semibold',
  gold:    'text-fall font-semibold',
  iridium: 'text-purple-500 font-semibold',
}

function roomProgress(room: BundleRoom, completed: CompletedMap) {
  let total = 0, done = 0
  for (const bundle of room.bundles) {
    const needed = bundle.required ?? bundle.items.length
    const count  = bundle.items.filter((i) => completed[`${bundle.id}-${i.id}`]).length
    total += needed
    done  += Math.min(count, needed)
  }
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 }
}

function bundleProgress(bundle: BundleRoom['bundles'][number], completed: CompletedMap) {
  const needed = bundle.required ?? bundle.items.length
  const count  = bundle.items.filter((i) => completed[`${bundle.id}-${i.id}`]).length
  return { needed, count, done: count >= needed }
}

export default function BundlesPage() {
  const userId = useUserId()
  const [completed, setCompleted] = useState<CompletedMap>({})
  const [loading, setLoading]     = useState(true)
  const [openRoom, setOpenRoom]   = useState<string>(BUNDLE_ROOMS[0].id)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      if (!userId) { setCompleted({}); setLoading(false); return }
      const { data } = await supabase
        .from('bundle_items')
        .select('bundle_id, item_id, completed')
        .eq('user_id', userId)
      const map: CompletedMap = {}
      for (const row of (data ?? []) as { bundle_id: string; item_id: string; completed: boolean }[]) {
        map[`${row.bundle_id}-${row.item_id}`] = row.completed
      }
      setCompleted(map)
      setLoading(false)
    }
    load()
  }, [])

  const toggle = async (bundleId: string, itemId: string) => {
    const key     = `${bundleId}-${itemId}`
    const current = completed[key] ?? false
    setCompleted((prev) => ({ ...prev, [key]: !current }))
    if (!userId) return
    await supabase.from('bundle_items').upsert(
      { user_id: userId, bundle_id: bundleId, item_id: itemId, completed: !current },
      { onConflict: 'user_id,bundle_id,item_id' }
    )
  }

  const allKeys    = BUNDLE_ROOMS.flatMap((r) => r.bundles.flatMap((b) => b.items.map((i) => `${b.id}-${i.id}`)))
  const totalDone  = allKeys.filter((k) => completed[k]).length
  const totalPct   = allKeys.length ? Math.round((totalDone / allKeys.length) * 100) : 0

  return (
    <div className="p-4 md:p-8 max-w-3xl">

      {/* Header */}
      <div className="mb-7">
        <h2 className="text-2xl font-semibold text-ink">Community Center</h2>
        <p className="text-muted text-sm mt-1">Track your bundle progress room by room.</p>
      </div>

      {/* Overall progress */}
      <div className="bg-white border border-parchment rounded-2xl p-5 mb-8" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-ink">Overall progress</span>
          <span className="text-sm font-bold text-ink">{totalDone}<span className="text-muted font-normal"> / {allKeys.length}</span></span>
        </div>
        <div className="h-2.5 w-full bg-cream-dark rounded-full overflow-hidden">
          <div className="h-full bg-green rounded-full transition-all duration-500" style={{ width: `${totalPct}%` }} />
        </div>
        <p className="text-xs text-muted mt-2">{totalPct}% complete</p>
      </div>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : (
        <div className="space-y-3">
          {BUNDLE_ROOMS.map((room) => {
            const c = ROOM_COLORS[room.id]
            const { total, done, pct } = roomProgress(room, completed)
            const isOpen     = openRoom === room.id
            const isComplete = done === total

            return (
              <div key={room.id}
                className={`bg-white border rounded-2xl overflow-hidden transition-all ${isOpen ? c.border + ' ring-1' : 'border-parchment'}`}
                style={{ boxShadow: 'var(--shadow-card)' }}>

                {/* Room header */}
                <button
                  onClick={() => setOpenRoom(isOpen ? '' : room.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-cream/40 transition-colors text-left"
                >
                  <span className="text-2xl">{room.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="font-semibold text-ink text-sm">{room.name}</p>
                      {isComplete && (
                        <span className="text-[10px] bg-green text-cream px-2 py-0.5 rounded-full font-medium">✓ Complete</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-cream-dark rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${c.bar}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] text-muted flex-shrink-0">{done}/{total}</span>
                    </div>
                  </div>
                  <span className="text-muted text-xs ml-1">{isOpen ? '▲' : '▼'}</span>
                </button>

                {/* Bundles */}
                {isOpen && (
                  <div className={`border-t border-parchment/50 ${c.bg} divide-y divide-parchment/40`}>
                    {room.bundles.map((bundle) => {
                      const bp = bundleProgress(bundle, completed)
                      return (
                        <div key={bundle.id} className="px-5 py-4">

                          {/* Bundle header */}
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <p className="text-sm font-semibold text-ink truncate">{bundle.name} Bundle</p>
                              {bp.done && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${c.tag}`}>Done</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {bundle.required && (
                                <span className="text-[10px] bg-cream-dark text-muted px-2 py-0.5 rounded-full">
                                  {bp.count}/{bundle.required} needed
                                </span>
                              )}
                              <span className="text-[10px] text-green font-medium">→ {bundle.reward}</span>
                            </div>
                          </div>

                          {/* Items */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {bundle.items.map((item) => {
                              const key  = `${bundle.id}-${item.id}`
                              const done = completed[key] ?? false
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => toggle(bundle.id, item.id)}
                                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                                    done
                                      ? 'bg-white/50 border-transparent opacity-50'
                                      : 'bg-white border-parchment/80 hover:border-brown-light hover:shadow-sm'
                                  }`}
                                >
                                  {/* Checkbox */}
                                  <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                                    done ? c.check : 'border-2 border-parchment bg-cream'
                                  }`}>
                                    {done && <span className="text-[10px] font-bold">✓</span>}
                                  </div>

                                  {/* Name + meta */}
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium leading-tight ${done ? 'line-through text-muted' : 'text-ink'}`}>
                                      {item.name}
                                    </p>
                                    {(item.quantity || item.quality) && (
                                      <p className="text-[11px] mt-0.5 flex items-center gap-1.5">
                                        {item.quantity && <span className="text-muted">×{item.quantity}</span>}
                                        {item.quality  && <span className={QUALITY_STYLE[item.quality] ?? 'text-muted'}>{item.quality}</span>}
                                      </p>
                                    )}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
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

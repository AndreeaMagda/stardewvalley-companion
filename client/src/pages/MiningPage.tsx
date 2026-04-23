import { useEffect, useState } from 'react'
import { MINE_ZONES } from '@shared'
import type { MineZone } from '@shared'
import { supabase, USER_ID } from '../api/supabase'

type MineProgress = { mines_floor: number; skull_floor: number }

const THEME = {
  earth: {
    zone:       'border-brown/40 bg-brown/5',
    header:     'bg-brown/10 text-brown',
    bar:        'bg-brown',
    milestone:  'bg-brown/10 text-brown border-brown/20',
    badge:      'text-brown',
  },
  frost: {
    zone:       'border-winter/40 bg-winter/5',
    header:     'bg-winter/10 text-winter',
    bar:        'bg-winter',
    milestone:  'bg-winter/10 text-winter border-winter/20',
    badge:      'text-winter',
  },
  fire: {
    zone:       'border-fall/40 bg-fall/5',
    header:     'bg-fall/10 text-fall',
    bar:        'bg-fall',
    milestone:  'bg-fall/10 text-fall border-fall/20',
    badge:      'text-fall',
  },
  void: {
    zone:       'border-purple-300/40 bg-purple-50',
    header:     'bg-purple-100 text-purple-700',
    bar:        'bg-purple-500',
    milestone:  'bg-purple-50 text-purple-700 border-purple-200',
    badge:      'text-purple-700',
  },
}

const RARITY_COLOR: Record<string, string> = {
  common:      'text-muted',
  uncommon:    'text-spring',
  rare:        'text-winter',
  'very rare': 'text-fall font-semibold',
}

const TYPE_ICON: Record<string, string> = {
  ore:     '⛏️',
  gem:     '💎',
  mineral: '🪨',
  fish:    '🐟',
  geode:   '🪨',
}

function floorPct(floor: number) {
  return Math.min(Math.round((floor / 120) * 100), 100)
}

function activeZone(floor: number): string {
  if (floor <= 0)   return ''
  if (floor <= 39)  return 'earth'
  if (floor <= 79)  return 'frost'
  if (floor <= 120) return 'fire'
  return ''
}

export default function MiningPage() {
  const [progress, setProgress] = useState<MineProgress>({ mines_floor: 0, skull_floor: 0 })
  const [draft, setDraft]       = useState<MineProgress>({ mines_floor: 0, skull_floor: 0 })
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('mine_progress')
        .select('*')
        .eq('user_id', USER_ID)
        .maybeSingle()
      if (data) {
        setProgress({ mines_floor: data.mines_floor, skull_floor: data.skull_floor })
        setDraft({ mines_floor: data.mines_floor, skull_floor: data.skull_floor })
      }
    }
    load()
  }, [])

  const save = async () => {
    setSaving(true)
    await supabase.from('mine_progress').upsert(
      { user_id: USER_ID, mines_floor: draft.mines_floor, skull_floor: draft.skull_floor, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
    setProgress(draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const current = activeZone(progress.mines_floor)

  return (
    <div className="p-4 md:p-8 max-w-3xl">

      {/* Header */}
      <div className="mb-7">
        <h2 className="text-2xl font-semibold text-ink">Mining Guide</h2>
        <p className="text-muted text-sm mt-1">What drops on each floor of the Mines.</p>
      </div>

      {/* Depth tracker */}
      <div className="bg-white border border-parchment rounded-2xl p-5 mb-8" style={{ boxShadow: 'var(--shadow-card)' }}>
        <p className="text-xs uppercase tracking-widest text-muted mb-4">Your progress</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Mines */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-ink">The Mines</span>
              <span className="text-sm font-bold text-ink">Floor {draft.mines_floor}</span>
            </div>
            <input
              type="range" min={0} max={120} value={draft.mines_floor}
              onChange={(e) => setDraft((p) => ({ ...p, mines_floor: Number(e.target.value) }))}
              className="w-full accent-brown"
            />
            <div className="flex justify-between text-[10px] text-muted mt-0.5">
              <span>0</span><span>40</span><span>80</span><span>120</span>
            </div>
            <div className="h-1.5 w-full bg-cream-dark rounded-full overflow-hidden mt-2">
              <div className="h-full bg-brown rounded-full transition-all duration-300"
                style={{ width: `${floorPct(draft.mines_floor)}%` }} />
            </div>
          </div>

          {/* Skull Cavern */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-ink">Skull Cavern</span>
              <span className="text-sm font-bold text-ink">
                {draft.skull_floor > 0 ? `Floor ${draft.skull_floor}` : 'Locked'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => setDraft((p) => ({ ...p, skull_floor: Math.max(0, p.skull_floor - 10) }))}
                className="w-8 h-8 rounded-lg bg-cream-dark text-muted text-sm font-bold flex items-center justify-center hover:bg-parchment transition-colors">−</button>
              <input
                type="number" min={0} value={draft.skull_floor}
                onChange={(e) => setDraft((p) => ({ ...p, skull_floor: Math.max(0, Number(e.target.value)) }))}
                className="flex-1 text-center text-ink font-bold text-sm border border-parchment rounded-lg py-1.5 focus:outline-none focus:border-brown bg-cream"
              />
              <button onClick={() => setDraft((p) => ({ ...p, skull_floor: p.skull_floor + 10 }))}
                className="w-8 h-8 rounded-lg bg-cream-dark text-muted text-sm font-bold flex items-center justify-center hover:bg-parchment transition-colors">+</button>
            </div>
            <p className="text-[10px] text-muted mt-1.5 text-center">Deeper = more Iridium</p>
          </div>
        </div>

        <button onClick={save} disabled={saving}
          className="w-full py-2 text-sm font-medium bg-brown hover:bg-brown-light text-cream rounded-xl transition-colors">
          {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save progress'}
        </button>
      </div>

      {/* Zone cards */}
      <div className="space-y-4">
        {MINE_ZONES.map((zone) => {
          const t = THEME[zone.theme]
          const isActive = zone.id === current || (zone.id === 'skull' && progress.skull_floor > 0)
          const unlocked = zone.id === 'skull'
            ? progress.mines_floor >= 120
            : progress.mines_floor >= zone.floorStart

          return (
            <ZoneCard key={zone.id} zone={zone} theme={t} isActive={isActive} unlocked={unlocked} currentFloor={progress.mines_floor} />
          )
        })}
      </div>
    </div>
  )
}

function ZoneCard({
  zone, theme, isActive, unlocked, currentFloor,
}: {
  zone: MineZone
  theme: typeof THEME['earth']
  isActive: boolean
  unlocked: boolean
  currentFloor: number
}) {
  const [open, setOpen] = useState(isActive)

  const gems      = zone.items.filter((i) => i.type === 'gem')
  const ores      = zone.items.filter((i) => i.type === 'ore')
  const minerals  = zone.items.filter((i) => i.type === 'mineral' || i.type === 'geode')
  const fish      = zone.items.filter((i) => i.type === 'fish')

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${isActive ? theme.zone + ' ring-1' : 'border-parchment bg-white'}`}
      style={{ boxShadow: 'var(--shadow-card)' }}>

      {/* Zone header */}
      <button onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-black/5 transition-colors">
        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${theme.header}`}>
          {zone.floors}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-ink text-sm">{zone.name}</p>
          {isActive && (
            <p className={`text-[11px] font-medium ${theme.badge}`}>← You are here</p>
          )}
          {!unlocked && (
            <p className="text-[11px] text-muted">🔒 Not yet reached</p>
          )}
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {ores.length > 0    && <span className="text-[10px] bg-cream-dark text-muted px-1.5 py-0.5 rounded">⛏️ {ores.length} ores</span>}
          {gems.length > 0    && <span className="text-[10px] bg-cream-dark text-muted px-1.5 py-0.5 rounded">💎 {gems.length} gems</span>}
          {minerals.length > 0 && <span className="text-[10px] bg-cream-dark text-muted px-1.5 py-0.5 rounded">🪨 {minerals.length} minerals</span>}
        </div>
        <span className="text-muted text-sm ml-2">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-parchment/50">

          {/* Items grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

            {ores.length > 0 && (
              <ItemGroup title="Ores" items={ores} />
            )}
            {gems.length > 0 && (
              <ItemGroup title="Gems" items={gems} />
            )}
            {minerals.length > 0 && (
              <ItemGroup title="Minerals & Geodes" items={minerals} />
            )}
            {fish.length > 0 && (
              <ItemGroup title="Fish (pools)" items={fish} />
            )}
          </div>

          {/* Milestones */}
          {zone.milestones.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Key milestones</p>
              <div className="space-y-1.5">
                {zone.milestones.map((m) => {
                  const reached = zone.id === 'skull'
                    ? true
                    : currentFloor >= m.floor
                  return (
                    <div key={`${m.floor}-${m.label}`}
                      className={`flex items-start gap-3 px-3 py-2 rounded-xl border text-xs ${
                        reached ? theme.milestone : 'bg-cream/50 border-parchment/50 text-muted'
                      }`}>
                      <span className={`font-bold flex-shrink-0 ${reached ? '' : 'opacity-40'}`}>
                        {zone.id === 'skull' ? 'SC' : `F${m.floor}`}
                      </span>
                      <div>
                        <p className="font-medium">{m.label}</p>
                        <p className="opacity-70 text-[11px]">{m.reward}</p>
                      </div>
                      {reached && <span className="ml-auto flex-shrink-0">✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ItemGroup({ title, items }: { title: string; items: MineZone['items'] }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-muted mb-1.5">{title}</p>
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.name} className="flex items-center gap-2 bg-white/70 border border-parchment/60 rounded-xl px-3 py-1.5">
            <span className="text-sm">{TYPE_ICON[item.type]}</span>
            <span className="text-sm text-ink font-medium flex-1">{item.name}</span>
            <span className={`text-[10px] ${RARITY_COLOR[item.rarity]}`}>{item.rarity}</span>
            <span className="text-[10px] text-muted">{item.sellPrice}g</span>
          </div>
        ))}
      </div>
    </div>
  )
}

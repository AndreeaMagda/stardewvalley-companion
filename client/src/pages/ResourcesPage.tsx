import { useEffect, useState } from 'react'
import type { Resource } from '@shared'
import { supabase } from '../api/supabase'
import { useUserId } from '../hooks/useUserId'
import { resourceSprite } from '../data/sprites'
import { Layers, Pickaxe, Sprout, Shield, type LucideIcon } from 'lucide-react'

// ── data ──────────────────────────────────────────────────────────────────────

interface ResourceItem {
  name: string
  source: string
  usedFor: string[]
  sellPrice: number
  tip?: string
}

const RESOURCE_GROUPS: { label: string; Icon: LucideIcon; items: ResourceItem[] }[] = [
  {
    label: 'Basic Materials',
    Icon: Layers,
    items: [
      {
        name: 'Wood',
        source: 'Chop trees and fallen logs on your farm',
        usedFor: ['Farm buildings', 'Fences', 'Furnace', 'Crafting recipes'],
        sellPrice: 2,
        tip: 'Robin needs 100–450 Wood for most farm buildings. Stock up early.',
      },
      {
        name: 'Stone',
        source: 'Break rocks with a pickaxe, Mines',
        usedFor: ['Furnace (25 Stone)', 'Bee House', 'Buildings', 'Paths & floors'],
        sellPrice: 2,
        tip: 'You need 25 Stone + 20 Copper Ore to craft the Furnace — do this on Day 5+.',
      },
      {
        name: 'Fiber',
        source: 'Cut weeds and grass with a scythe',
        usedFor: ['Basic Fertilizer (2 Fiber)', 'Scarecrow (50)', 'Speed-Gro', 'Quality Retaining Soil'],
        sellPrice: 1,
        tip: "Leave some grass patches on your farm — it refills naturally and keeps a Fiber supply.",
      },
      {
        name: 'Sap',
        source: 'Drops when chopping any tree',
        usedFor: ['Basic Fertilizer (5 Sap → 1)', 'Tree Fertilizer', 'Oil of Garlic'],
        sellPrice: 2,
        tip: "You'll accumulate thousands just by farming. Don't throw it away early.",
      },
      {
        name: 'Hardwood',
        source: 'Large stumps (farm), Secret Woods (12/day)',
        usedFor: ['Stable (100)', 'Cork Bobber', 'Farmhouse upgrade 2', 'Warp Totem: Farm'],
        sellPrice: 15,
        tip: 'Requires a Copper Axe or better. The Secret Woods (SW of farm) yields 12/day.',
      },
    ],
  },
  {
    label: 'Ores & Bars',
    Icon: Pickaxe,
    items: [
      {
        name: 'Coal',
        source: 'Mines floors 41–79, Dust Sprites, Blacksmith (250g)',
        usedFor: ['Smelting all bars (1 Coal per bar)', 'Bombs', 'Heat up Furnace'],
        sellPrice: 15,
        tip: 'Dust Sprites on floors 41–79 are the best renewable coal source. Farm them.',
      },
      {
        name: 'Copper Ore',
        source: 'Mines floors 2–39, Copper Nodes',
        usedFor: ['Copper Bar (5 Ore + 1 Coal, 30 min)', 'Furnace (20 Ore)', 'Copper tools'],
        sellPrice: 5,
        tip: 'Rush floor 40 in Year 1 Spring. You need Copper Bars for your first Sprinkler.',
      },
      {
        name: 'Iron Ore',
        source: 'Mines floors 40–79, Iron Nodes',
        usedFor: ['Iron Bar (5 Ore + 1 Coal, 2 hrs)', 'Sprinkler', 'Tool upgrades', 'Bombs'],
        sellPrice: 10,
        tip: 'Iron Bars unlock the basic Sprinkler (1 Iron + 1 Copper Bar) — a game-changer.',
      },
      {
        name: 'Gold Ore',
        source: 'Mines floors 80–120, Skull Cavern',
        usedFor: ['Gold Bar (5 Ore + 1 Coal, 5 hrs)', 'Quality Sprinkler', 'Bee House', 'Keg'],
        sellPrice: 25,
        tip: 'Gold Bars are needed for the Keg (30g → 525g for Starfruit Wine). High priority.',
      },
      {
        name: 'Iridium Ore',
        source: 'Skull Cavern (Desert), Iridium Nodes',
        usedFor: ['Iridium Bar (5 Ore + 1 Coal, 8 hrs)', 'Iridium Sprinkler', 'Iridium tools'],
        sellPrice: 100,
        tip: 'Bring Bombs + staircases to Skull Cavern. Deeper floors = more Iridium Nodes.',
      },
    ],
  },
  {
    label: 'Farming Supplies',
    Icon: Sprout,
    items: [
      {
        name: 'Mixed Seeds',
        source: 'Cut weeds with a scythe (random drop)',
        usedFor: ['Plant for a random seasonal crop', 'Early-game free food/income'],
        sellPrice: 0,
        tip: 'The crop you get depends on the current season. Can yield Melons or Pumpkins!',
      },
      {
        name: 'Basic Fertilizer',
        source: 'Craft: 2 Sap → 1. Buy from Pierre (100g, Spring Year 1)',
        usedFor: ['Increases chance of Normal quality crops', 'Apply before planting'],
        sellPrice: 2,
        tip: 'Easy to craft from excess Sap. Always fertilize expensive crops like Strawberry.',
      },
      {
        name: 'Quality Fertilizer',
        source: 'Craft: 2 Sap + 1 Fish → 1. Pierre sells in Year 2 (150g)',
        usedFor: ['Greatly increases Gold/Iridium quality crops', 'Best on high-value crops'],
        sellPrice: 10,
        tip: 'Use on Starfruit, Ancient Fruit, and Melon. Gold quality adds 50% sell value.',
      },
      {
        name: 'Speed-Gro',
        source: "Pierre (Year 2, 80g), Spring Foraging Bundle reward",
        usedFor: ['Reduces grow time by 10%', 'Stacks with Agriculturist profession (10% more)'],
        sellPrice: 20,
        tip: 'Most impactful on slow crops: Cauliflower (12d), Pumpkin (13d), Ancient Fruit (28d).',
      },
    ],
  },
  {
    label: 'Combat & Fishing',
    Icon: Shield,
    items: [
      {
        name: 'Bait',
        source: 'Craft: 1 Bug Meat → 5 Bait (Fishing Lv 2). Willy sells for 5g each',
        usedFor: ['Halves fishing bite time', 'Required for Crab Pots to catch fish'],
        sellPrice: 1,
        tip: 'Bug Meat drops from Cave Insects in the Mines (floors 1–29). Easy to farm.',
      },
      {
        name: 'Bomb',
        source: 'Craft: 4 Iron Ore + 1 Coal (Mining Lv 6). Dwarf sells for 600g',
        usedFor: ['3-tile radius explosion', 'Clears rocks and enemies', 'Skull Cavern runs'],
        sellPrice: 50,
        tip: 'The standard bomb for Skull Cavern. Bring 30+ for an efficient deep run.',
      },
      {
        name: 'Cherry Bomb',
        source: 'Craft: 4 Copper Ore + 1 Coal (Mining Lv 1)',
        usedFor: ['2-tile radius explosion', 'Cheaper early-game bomb', 'Tight Mine corridors'],
        sellPrice: 50,
        tip: 'Cheapest bomb. Good in early Mines when you need to clear a path fast.',
      },
      {
        name: 'Mega Bomb',
        source: 'Craft: 4 Gold Ore + 1 Frozen Tear + 1 Fire Quartz (Mining Lv 8)',
        usedFor: ['4-tile radius explosion', 'Best for Skull Cavern speed-runs', 'Clears large areas'],
        sellPrice: 50,
        tip: 'The most powerful bomb. One Mega Bomb can clear an entire Skull Cavern floor.',
      },
    ],
  },
]

const ALL_ITEMS = RESOURCE_GROUPS.flatMap((g) => g.items.map((i) => i.name))

// ── component ──────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  const userId = useUserId()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading]     = useState(true)
  const [resetting, setResetting] = useState(false)

  const load = async () => {
    setLoading(true)
    if (!userId) { setLoading(false); return }
    const { data } = await supabase.from('resources').select('*').eq('user_id', userId)
    const existing      = (data as Resource[]) ?? []
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
    if (!userId) return
    const r = getResource(name)
    if (!r) return
    const newQty = Math.max(0, r.quantity + delta)
    await supabase.from('resources').update({ quantity: newQty, updated_at: new Date().toISOString() }).eq('id', r.id)
    setResources((prev) => prev.map((x) => x.type === name ? { ...x, quantity: newQty } : x))
  }

  const setQty = async (name: string, value: number) => {
    if (!userId) return
    const r = getResource(name)
    if (!r) return
    const newQty = Math.max(0, value)
    await supabase.from('resources').update({ quantity: newQty, updated_at: new Date().toISOString() }).eq('id', r.id)
    setResources((prev) => prev.map((x) => x.type === name ? { ...x, quantity: newQty } : x))
  }

  const resetAll = async () => {
    if (!userId) return
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
        {userId && (
          <button onClick={resetAll} disabled={resetting}
            className="text-xs text-muted hover:text-fall border border-parchment hover:border-fall/40 px-3 py-1.5 rounded-lg transition-colors">
            {resetting ? 'Resetting…' : 'Reset all'}
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : (
        <div className="space-y-10">
          {RESOURCE_GROUPS.map(({ label, Icon, items }) => (
            <section key={label}>
              <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted mb-4">
                <Icon size={12} strokeWidth={1.75} />{label}
              </p>
              <div className="space-y-3">
                {items.map(({ name, source, usedFor, sellPrice, tip }) => {
                  const qty = getResource(name)?.quantity ?? 0
                  return (
                    <div key={name}
                      className="bg-white border border-parchment rounded-2xl p-4 hover:border-brown-pale transition-all"
                      style={{ boxShadow: 'var(--shadow-card)' }}>

                      {/* Top row: sprite + name + sell price + controls */}
                      <div className="flex items-start gap-3">

                        {/* Sprite */}
                        {resourceSprite(name) && (
                          <img src={resourceSprite(name)!} alt={name}
                            width={28} height={28}
                            style={{ imageRendering: 'pixelated', flexShrink: 0, marginTop: 2 }}
                            referrerPolicy="no-referrer" />
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="text-sm font-semibold text-ink">{name}</p>
                            {sellPrice > 0 && (
                              <span className="text-[10px] bg-cream-dark text-muted px-1.5 py-0.5 rounded-full">
                                {sellPrice}g
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted mb-2">{source}</p>

                          {/* Used for pills */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {usedFor.map((u) => (
                              <span key={u}
                                className="text-[10px] bg-cream-dark text-ink px-2 py-0.5 rounded-full leading-tight">
                                {u}
                              </span>
                            ))}
                          </div>

                          {/* Tip */}
                          {tip && (
                            <p className="text-[11px] text-brown/80 leading-snug border-l-2 border-brown/20 pl-2">
                              {tip}
                            </p>
                          )}
                        </div>

                        {/* Quantity controls — right side */}
                        {userId && (
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-2">
                            <div className="flex items-center gap-1">
                              <button onClick={() => updateQty(name, -10)}
                                className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-parchment text-muted text-[10px] font-bold transition-colors flex items-center justify-center">
                                ‹‹
                              </button>
                              <button onClick={() => updateQty(name, -1)}
                                className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-parchment text-ink text-base font-bold transition-colors flex items-center justify-center leading-none">
                                −
                              </button>
                              <input type="number" min={0} value={qty}
                                onChange={(e) => setQty(name, Number(e.target.value))}
                                className="w-14 text-center text-ink font-bold text-sm border border-parchment rounded-lg py-1 focus:outline-none focus:border-brown bg-cream" />
                              <button onClick={() => updateQty(name, 1)}
                                className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-parchment text-ink text-base font-bold transition-colors flex items-center justify-center leading-none">
                                +
                              </button>
                              <button onClick={() => updateQty(name, 10)}
                                className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-parchment text-muted text-[10px] font-bold transition-colors flex items-center justify-center">
                                ››
                              </button>
                            </div>
                            <p className="text-[10px] text-muted">in stock</p>
                          </div>
                        )}
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

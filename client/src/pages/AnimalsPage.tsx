import { useState, useEffect } from 'react'
import { Heart, Plus, Trash2, Egg } from 'lucide-react'

// ── types ─────────────────────────────────────────────────────────────────────

type BuildingFilter = 'all' | 'coop' | 'barn'

type AnimalDef = {
  id: string
  name: string
  building: string
  buildingType: 'coop' | 'barn'
  purchasePrice: number | null
  product: string
  productSell: number
  largeProduct?: string
  largeProductSell?: number
  artisanProduct?: string
  artisanSell?: number
  artisanMachine?: string
  frequency: string
  notes?: string
}

type MyAnimal = {
  id: string
  typeId: string
  name: string
  hearts: number
}

// ── data ──────────────────────────────────────────────────────────────────────

const ANIMALS: AnimalDef[] = [
  // Coop
  {
    id: 'chicken', name: 'Chicken', building: 'Coop', buildingType: 'coop',
    purchasePrice: 800, product: 'Egg', productSell: 50,
    largeProduct: 'Large Egg', largeProductSell: 95,
    artisanProduct: 'Mayonnaise', artisanSell: 190, artisanMachine: 'Mayo Machine',
    frequency: 'Daily',
  },
  {
    id: 'duck', name: 'Duck', building: 'Big Coop', buildingType: 'coop',
    purchasePrice: 1200, product: 'Duck Egg', productSell: 95,
    largeProduct: 'Duck Feather', largeProductSell: 250,
    artisanProduct: 'Duck Mayonnaise', artisanSell: 375, artisanMachine: 'Mayo Machine',
    frequency: 'Daily egg · rare feather at max ♥',
  },
  {
    id: 'rabbit', name: 'Rabbit', building: 'Deluxe Coop', buildingType: 'coop',
    purchasePrice: 8000, product: 'Wool', productSell: 340,
    largeProduct: "Rabbit's Foot", largeProductSell: 565,
    artisanProduct: 'Cloth', artisanSell: 470, artisanMachine: 'Loom',
    frequency: 'Daily wool · rare foot at max ♥',
  },
  {
    id: 'void-chicken', name: 'Void Chicken', building: 'Coop', buildingType: 'coop',
    purchasePrice: null, product: 'Void Egg', productSell: 65,
    artisanProduct: 'Void Mayo', artisanSell: 275, artisanMachine: 'Mayo Machine',
    frequency: 'Daily',
    notes: 'Hatch from a Void Egg in incubator',
  },
  {
    id: 'dinosaur', name: 'Dinosaur', building: 'Deluxe Coop', buildingType: 'coop',
    purchasePrice: null, product: 'Dinosaur Egg', productSell: 350,
    frequency: 'Every 7 days',
    notes: 'Hatch from Dinosaur Egg (mine floors 40–79)',
  },
  // Barn
  {
    id: 'cow', name: 'Cow', building: 'Barn', buildingType: 'barn',
    purchasePrice: 1500, product: 'Milk', productSell: 125,
    largeProduct: 'Large Milk', largeProductSell: 190,
    artisanProduct: 'Cheese', artisanSell: 230, artisanMachine: 'Cheese Press',
    frequency: 'Daily',
  },
  {
    id: 'goat', name: 'Goat', building: 'Big Barn', buildingType: 'barn',
    purchasePrice: 4000, product: 'Goat Milk', productSell: 225,
    largeProduct: 'Large Goat Milk', largeProductSell: 345,
    artisanProduct: 'Goat Cheese', artisanSell: 375, artisanMachine: 'Cheese Press',
    frequency: 'Daily',
  },
  {
    id: 'sheep', name: 'Sheep', building: 'Deluxe Barn', buildingType: 'barn',
    purchasePrice: 8000, product: 'Wool', productSell: 340,
    artisanProduct: 'Cloth', artisanSell: 470, artisanMachine: 'Loom',
    frequency: 'Every 3 days',
    notes: 'Shepherd profession: every 2 days',
  },
  {
    id: 'pig', name: 'Pig', building: 'Deluxe Barn', buildingType: 'barn',
    purchasePrice: 16000, product: 'Truffle', productSell: 625,
    artisanProduct: 'Truffle Oil', artisanSell: 1065, artisanMachine: 'Oil Maker',
    frequency: 'Daily outdoors (not in winter)',
    notes: 'Does not produce in winter or indoors',
  },
  {
    id: 'ostrich', name: 'Ostrich', building: 'Barn', buildingType: 'barn',
    purchasePrice: null, product: 'Ostrich Egg', productSell: 600,
    frequency: 'Every 7 days',
    notes: 'Hatch from Ostrich Egg found on Ginger Island',
  },
]

const BUILDING_COLOR: Record<string, string> = {
  'Coop':         'bg-spring/15 text-spring',
  'Big Coop':     'bg-spring/25 text-spring',
  'Deluxe Coop':  'bg-spring/35 text-spring',
  'Barn':         'bg-summer/15 text-summer',
  'Big Barn':     'bg-summer/25 text-summer',
  'Deluxe Barn':  'bg-summer/35 text-summer',
  'Any Coop':     'bg-spring/15 text-spring',
}

const ANIMAL_EMOJI: Record<string, string> = {
  chicken: '🐔', duck: '🦆', rabbit: '🐰',
  'void-chicken': '🖤', dinosaur: '🦕',
  cow: '🐄', goat: '🐐', sheep: '🐑', pig: '🐷', ostrich: '🦤',
}

// ── helpers ───────────────────────────────────────────────────────────────────

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function expectedProduct(animal: AnimalDef, hearts: number): { label: string; sell: number } {
  if (hearts >= 5 && animal.largeProduct) {
    return { label: animal.largeProduct, sell: animal.largeProductSell! }
  }
  return { label: animal.product, sell: animal.productSell }
}

// ── sub-components ────────────────────────────────────────────────────────────

function HeartRow({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1 === value ? 0 : i + 1)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Heart
            size={16}
            className={i < value ? 'text-red-400 fill-red-400' : 'text-muted/30'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  )
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function AnimalsPage() {
  const [tab, setTab] = useState<'reference' | 'mine'>('reference')
  const [buildingFilter, setBuildingFilter] = useState<BuildingFilter>('all')
  const [myAnimals, setMyAnimals] = useState<MyAnimal[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [newTypeId, setNewTypeId] = useState(ANIMALS[0].id)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    try {
      const s = localStorage.getItem('stardew-animals')
      if (s) setMyAnimals(JSON.parse(s))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('stardew-animals', JSON.stringify(myAnimals))
  }, [myAnimals])

  function addAnimal() {
    if (!newName.trim()) return
    const def = ANIMALS.find(a => a.id === newTypeId)!
    setMyAnimals(prev => [...prev, { id: newId(), typeId: newTypeId, name: newName.trim(), hearts: 0 }])
    setNewName('')
    setShowAdd(false)
    setNewTypeId(def.id)
  }

  function setHearts(id: string, hearts: number) {
    setMyAnimals(prev => prev.map(a => a.id === id ? { ...a, hearts } : a))
  }

  function removeAnimal(id: string) {
    setMyAnimals(prev => prev.filter(a => a.id !== id))
  }

  const visibleAnimals = ANIMALS.filter(
    a => buildingFilter === 'all' || a.buildingType === buildingFilter
  )

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="mb-7">
        <h2 className="text-2xl font-semibold text-ink">Animals</h2>
        <p className="text-muted text-sm mt-1">Barn & coop animals, products, and heart tracking.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-cream-dark rounded-xl p-1 mb-6 w-fit">
        {(['reference', 'mine'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              tab === t ? 'bg-ink text-cream' : 'text-muted hover:bg-parchment/60'
            }`}>
            {t === 'mine' ? 'My Farm' : 'Reference'}
          </button>
        ))}
      </div>

      {/* ── REFERENCE TAB ─────────────────────────────────────────────────── */}
      {tab === 'reference' && (
        <>
          {/* Building filter */}
          <div className="flex gap-1 bg-cream-dark rounded-xl p-1 mb-6 w-fit">
            {(['all', 'coop', 'barn'] as BuildingFilter[]).map(f => (
              <button key={f} onClick={() => setBuildingFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                  buildingFilter === f
                    ? f === 'coop' ? 'bg-spring text-white'
                    : f === 'barn' ? 'bg-summer text-white'
                    : 'bg-ink text-cream'
                    : 'text-muted hover:bg-parchment/60'
                }`}>
                {f === 'all' ? 'All' : f === 'coop' ? 'Coop' : 'Barn'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {visibleAnimals.map(animal => (
              <div key={animal.id}
                className="bg-white border border-parchment rounded-2xl p-4 hover:border-brown-pale transition-all"
                style={{ boxShadow: 'var(--shadow-card)' }}>

                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl leading-none">{ANIMAL_EMOJI[animal.id] ?? '🐾'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-ink text-sm">{animal.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${BUILDING_COLOR[animal.building] ?? 'bg-parchment text-muted'}`}>
                        {animal.building}
                      </span>
                      {animal.purchasePrice !== null
                        ? <span className="text-[10px] text-muted">{animal.purchasePrice.toLocaleString()}g</span>
                        : <span className="text-[10px] bg-brown/10 text-brown px-2 py-0.5 rounded-full">Hatch only</span>
                      }
                    </div>
                    <p className="text-[10px] text-muted mt-0.5">{animal.frequency}</p>
                  </div>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Regular */}
                  <div className="bg-cream-dark rounded-xl p-3 text-center">
                    <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Raw</p>
                    <p className="text-sm font-bold text-ink">{animal.productSell}g</p>
                    <p className="text-[10px] text-muted mt-0.5 truncate">{animal.product}</p>
                  </div>

                  {/* Large */}
                  <div className={`rounded-xl p-3 text-center border ${animal.largeProduct ? 'bg-spring/8 border-spring/20' : 'bg-cream-dark border-transparent'}`}>
                    <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Large</p>
                    {animal.largeProduct ? (
                      <>
                        <p className="text-sm font-bold text-green">{animal.largeProductSell}g</p>
                        <p className="text-[10px] text-muted mt-0.5 truncate">{animal.largeProduct}</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted/30 mt-1">—</p>
                    )}
                  </div>

                  {/* Artisan */}
                  <div className={`rounded-xl p-3 text-center border ${animal.artisanProduct ? 'bg-brown/5 border-brown/15' : 'bg-cream-dark border-transparent'}`}>
                    <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Artisan</p>
                    {animal.artisanProduct ? (
                      <>
                        <p className="text-sm font-bold text-brown">{animal.artisanSell}g</p>
                        <p className="text-[10px] text-muted mt-0.5 truncate">{animal.artisanMachine}</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted/30 mt-1">—</p>
                    )}
                  </div>
                </div>

                {animal.notes && (
                  <p className="text-[11px] text-brown/70 leading-snug border-l-2 border-brown/20 pl-2 mt-3">{animal.notes}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── MY FARM TAB ───────────────────────────────────────────────────── */}
      {tab === 'mine' && (
        <div className="space-y-3">
          {myAnimals.length === 0 && !showAdd && (
            <div className="text-center py-12 bg-white border border-parchment rounded-2xl"
              style={{ boxShadow: 'var(--shadow-card)' }}>
              <Egg size={32} className="text-muted/30 mx-auto mb-3" strokeWidth={1.25} />
              <p className="text-muted text-sm">No animals yet.</p>
              <p className="text-muted/60 text-xs mt-1">Add animals to track their hearts and products.</p>
            </div>
          )}

          {myAnimals.map(a => {
            const def = ANIMALS.find(d => d.id === a.typeId)!
            const prod = expectedProduct(def, a.hearts)
            return (
              <div key={a.id}
                className="bg-white border border-parchment rounded-2xl p-4 hover:border-brown-pale transition-all"
                style={{ boxShadow: 'var(--shadow-card)' }}>

                <div className="flex items-center gap-3">
                  <span className="text-2xl leading-none flex-shrink-0">{ANIMAL_EMOJI[a.typeId] ?? '🐾'}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="font-semibold text-ink text-sm leading-tight">{a.name}</p>
                      <p className="text-[11px] text-muted">{def.name}</p>
                    </div>
                    <HeartRow value={a.hearts} onChange={n => setHearts(a.id, n)} />
                  </div>

                  <div className="text-right flex-shrink-0 mr-2">
                    <p className="text-sm font-bold text-green">{prod.sell}g</p>
                    <p className="text-[10px] text-muted truncate max-w-[90px]">{prod.label}</p>
                  </div>

                  <button onClick={() => removeAnimal(a.id)}
                    className="text-muted/30 hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>

                {def.artisanProduct && (
                  <p className="text-[11px] text-brown/60 mt-2 pl-9">
                    Best: {def.artisanProduct} ({def.artisanSell}g) via {def.artisanMachine}
                  </p>
                )}
              </div>
            )
          })}

          {/* Add animal form */}
          {showAdd ? (
            <div className="bg-white border border-brown/20 rounded-2xl p-4"
              style={{ boxShadow: 'var(--shadow-card)' }}>
              <p className="text-sm font-semibold text-ink mb-3">Add animal</p>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={newTypeId}
                    onChange={e => setNewTypeId(e.target.value)}
                    className="flex-1 border border-parchment rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-brown"
                  >
                    {ANIMALS.map(a => (
                      <option key={a.id} value={a.id}>{ANIMAL_EMOJI[a.id]} {a.name}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Name your animal…"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addAnimal()}
                  autoFocus
                  className="w-full border border-parchment rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brown placeholder:text-muted/50"
                />
                <div className="flex gap-2">
                  <button onClick={addAnimal}
                    disabled={!newName.trim()}
                    className="flex-1 bg-green text-cream rounded-xl py-2 text-sm font-medium hover:bg-green-light transition-colors disabled:opacity-40">
                    Add
                  </button>
                  <button onClick={() => { setShowAdd(false); setNewName('') }}
                    className="px-4 bg-cream-dark rounded-xl py-2 text-sm text-muted hover:bg-parchment transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-parchment rounded-2xl text-muted text-sm hover:border-brown/30 hover:text-ink transition-all"
            >
              <Plus size={16} />
              Add animal
            </button>
          )}
        </div>
      )}
    </div>
  )
}

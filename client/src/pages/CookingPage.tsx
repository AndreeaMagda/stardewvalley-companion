import { useState } from 'react'
import { Search, Zap, Tv, Heart } from 'lucide-react'

// ── data ──────────────────────────────────────────────────────────────────────

interface Recipe {
  name: string
  ingredients: string[]
  energy: number
  sell: number
  buff?: string
  unlock: string
}

const RECIPES: Recipe[] = [
  // Skill unlocks
  { name: "Farmer's Lunch",     ingredients: ['Omelet', 'Parsnip'],                                  energy: 500, sell: 150, buff: 'Farming +3',  unlock: 'Farming Lv 3' },
  { name: "Miner's Treat",      ingredients: ['Cave Carrot', 'Milk', 'Sugar'],                       energy: 125, sell: 200, buff: 'Mining +3',   unlock: 'Mining Lv 3' },
  { name: 'Survival Burger',    ingredients: ['Bread', 'Cave Carrot', 'Eggplant'],                   energy: 125, sell: 180, buff: 'Foraging +3', unlock: 'Foraging Lv 2' },
  { name: "Dish O' The Sea",    ingredients: ['Sardine', 'Hashbrowns'],                              energy: 150, sell: 220, buff: 'Fishing +3',  unlock: 'Fishing Lv 3' },
  { name: 'Roots Platter',      ingredients: ['Cave Carrot', 'Winter Root'],                         energy: 125, sell: 100, buff: 'Defense +3',  unlock: 'Combat Lv 3' },
  // TV / Default
  { name: 'Fried Egg',          ingredients: ['Egg'],                                                 energy: 50,  sell: 35,  unlock: 'Default' },
  { name: 'Hashbrowns',         ingredients: ['Potato', 'Oil'],                                       energy: 75,  sell: 120, unlock: 'Queen of Sauce' },
  { name: 'Pancakes',           ingredients: ['Wheat Flour', 'Egg'],                                  energy: 175, sell: 80,  unlock: 'Queen of Sauce' },
  { name: 'Omelet',             ingredients: ['Egg', 'Milk'],                                         energy: 100, sell: 125, unlock: 'Queen of Sauce' },
  { name: 'Bread',              ingredients: ['Wheat Flour'],                                         energy: 100, sell: 60,  unlock: 'Queen of Sauce' },
  { name: 'Maki Roll',          ingredients: ['Fish', 'Seaweed', 'Rice'],                            energy: 100, sell: 220, unlock: 'Queen of Sauce' },
  { name: 'Radish Salad',       ingredients: ['Radish', 'Oil', 'Vinegar'],                           energy: 78,  sell: 300, unlock: 'Queen of Sauce' },
  { name: 'Stir Fry',           ingredients: ['Cave Carrot', 'Common Mushroom', 'Kale', 'Oil'],      energy: 225, sell: 335, unlock: 'Queen of Sauce' },
  { name: 'Chocolate Cake',     ingredients: ['Wheat Flour', 'Egg', 'Sugar'],                        energy: 270, sell: 200, unlock: 'Queen of Sauce' },
  { name: 'Pink Cake',          ingredients: ['Melon', 'Wheat Flour', 'Egg', 'Sugar'],               energy: 450, sell: 480, unlock: 'Queen of Sauce' },
  // Friendship
  { name: 'Parsnip Soup',       ingredients: ['Parsnip', 'Milk', 'Vinegar'],                         energy: 144, sell: 120, unlock: 'Caroline (3♥)' },
  { name: 'Salad',              ingredients: ['Leek', 'Dandelion', 'Vinegar'],                       energy: 113, sell: 110, unlock: 'Emily (3♥)' },
  { name: 'Cheese Cauliflower', ingredients: ['Cauliflower', 'Cheese'],                              energy: 190, sell: 300, unlock: 'Pam (3♥)' },
  { name: 'Sashimi',            ingredients: ['Fish'],                                                energy: 75,  sell: 75,  unlock: 'Linus (3♥)' },
  { name: 'Fried Calamari',     ingredients: ['Squid', 'Wheat Flour', 'Oil'],                        energy: 100, sell: 150, unlock: 'Pierre (3♥)' },
  { name: 'Pizza',              ingredients: ['Wheat Flour', 'Tomato', 'Cheese'],                    energy: 150, sell: 300, unlock: 'Sam (3♥)' },
  { name: 'Cookie',             ingredients: ['Wheat Flour', 'Butter', 'Sugar'],                     energy: 90,  sell: 140, unlock: 'Evelyn (4♥)' },
  { name: 'Blueberry Tart',     ingredients: ['Blueberry', 'Sugar', 'Wheat Flour', 'Egg'],           energy: 125, sell: 150, unlock: 'Pierre (7♥)' },
  { name: 'Bean Hotpot',        ingredients: ['Green Bean ×2'],                                      energy: 100, sell: 100, unlock: 'Clint (7♥)' },
  { name: 'Fish Taco',          ingredients: ['Tuna', 'Tortilla', 'Red Cabbage', 'Mayonnaise'],      energy: 200, sell: 500, unlock: 'Willy (7♥)' },
  { name: 'Pumpkin Soup',       ingredients: ['Pumpkin', 'Milk'],                                    energy: 200, sell: 300, unlock: 'Robin (7♥)' },
  { name: 'Tom Kha Soup',       ingredients: ['Coconut', 'Shrimp', 'Common Mushroom'],               energy: 250, sell: 500, unlock: 'Sandy (7♥)' },
]

function heartsFromUnlock(unlock: string): number {
  return parseInt(unlock.match(/(\d+)♥/)?.[1] ?? '0')
}

const BUFF_RECIPES   = RECIPES.filter((r) => r.buff)
const TV_RECIPES     = RECIPES.filter((r) => !r.buff && (r.unlock === 'Default' || r.unlock.startsWith('Queen')))
                               .sort((a, b) => b.energy - a.energy)
const FRIEND_RECIPES = RECIPES.filter((r) => !r.buff && r.unlock.includes('♥'))
                               .sort((a, b) => heartsFromUnlock(a.unlock) - heartsFromUnlock(b.unlock) || a.name.localeCompare(b.name))

// ── card ──────────────────────────────────────────────────────────────────────

function RecipeCard({ r, highlight = '' }: { r: Recipe; highlight?: string }) {
  const q = highlight.toLowerCase()
  return (
    <div
      className="bg-white border border-parchment rounded-2xl p-4 hover:border-brown-pale transition-all"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {/* Name + stats row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <p className="text-sm font-semibold text-ink leading-tight">{r.name}</p>
          {r.buff && (
            <span className="flex items-center gap-0.5 text-[10px] bg-summer/15 text-summer px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
              <Zap size={9} strokeWidth={2.5} />{r.buff}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 text-right">
          <span className="flex items-center gap-0.5 text-xs font-bold text-ink">
            <Zap size={10} className="text-summer" strokeWidth={2} />{r.energy}
          </span>
          <span className="text-[10px] bg-cream-dark text-muted px-1.5 py-0.5 rounded-full">{r.sell}g</span>
        </div>
      </div>

      {/* Ingredients */}
      <div className="flex flex-wrap gap-1 mb-2">
        {r.ingredients.map((ing) => {
          const isMatch = q && ing.toLowerCase().includes(q)
          return (
            <span
              key={ing}
              className={`text-[10px] px-2 py-0.5 rounded-full leading-tight ${
                isMatch ? 'bg-brown/15 text-brown font-semibold' : 'bg-cream-dark text-ink'
              }`}
            >
              {ing}
            </span>
          )
        })}
      </div>

      {/* Unlock */}
      <p className="text-[10px] text-muted">{r.unlock}</p>
    </div>
  )
}

// ── section header ─────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted mb-3">
      <Icon size={11} strokeWidth={1.75} />{label}
    </p>
  )
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function CookingPage() {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const filtered = q
    ? RECIPES.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.ingredients.some((i) => i.toLowerCase().includes(q)) ||
          r.unlock.toLowerCase().includes(q),
      )
    : null

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ink">Cooking</h2>
        <p className="text-muted text-sm mt-1">Recipes and ingredients. Search by ingredient to find what you can cook.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search recipe or ingredient…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-parchment rounded-xl bg-white text-ink placeholder:text-muted focus:outline-none focus:border-brown"
        />
      </div>

      {/* Search results */}
      {filtered !== null && (
        filtered.length === 0
          ? <p className="text-sm text-muted text-center py-10">No results for "{query}"</p>
          : <div className="space-y-3">
              {filtered.map((r) => <RecipeCard key={r.name} r={r} highlight={q} />)}
            </div>
      )}

      {/* Default: 3 non-overlapping sections */}
      {filtered === null && (
        <div className="space-y-10">
          <div>
            <SectionHeader icon={Zap} label="Skill Buffs" />
            <div className="space-y-3">
              {BUFF_RECIPES.map((r) => <RecipeCard key={r.name} r={r} />)}
            </div>
          </div>

          <div>
            <SectionHeader icon={Tv} label="Queen of Sauce & Default" />
            <div className="space-y-3">
              {TV_RECIPES.map((r) => <RecipeCard key={r.name} r={r} />)}
            </div>
          </div>

          <div>
            <SectionHeader icon={Heart} label="Friendship Recipes" />
            <div className="space-y-3">
              {FRIEND_RECIPES.map((r) => <RecipeCard key={r.name} r={r} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Search, Star } from 'lucide-react'
import { villagerSprite } from '../data/sprites'

// ── data ──────────────────────────────────────────────────────────────────────

const UNIVERSAL_LOVES = [
  'Golden Pumpkin', 'Magic Rock Candy', 'Pearl', 'Prismatic Shard', "Rabbit's Foot",
]

interface VG { name: string; loves: string[] }

const VILLAGERS: VG[] = [
  { name: 'Abigail',   loves: ['Amethyst', 'Blackberry Cobbler', 'Chocolate Cake', 'Pufferfish', 'Pumpkin', 'Spicy Eel'] },
  { name: 'Alex',      loves: ['Complete Breakfast', 'Salmon Dinner'] },
  { name: 'Caroline',  loves: ['Summer Spangle', 'Tropical Curry'] },
  { name: 'Clint',     loves: ['Artichoke Dip', 'Fiddlehead Risotto', 'Gold Bar', 'Iridium Bar', 'Omni Geode'] },
  { name: 'Demetrius', loves: ['Bean Hotpot', 'Ice Cream', 'Rice Pudding', 'Strawberry'] },
  { name: 'Dwarf',     loves: ['Amethyst', 'Aquamarine', 'Emerald', 'Iridium Bar', 'Jade', 'Omni Geode', 'Ruby', 'Topaz'] },
  { name: 'Elliott',   loves: ['Crab Cakes', 'Duck Feather', 'Lobster', 'Pomegranate', 'Tom Kha Soup'] },
  { name: 'Emily',     loves: ['Amethyst', 'Aquamarine', 'Cloth', 'Emerald', 'Jade', 'Ruby', 'Survival Burger', 'Topaz', 'Wool'] },
  { name: 'Evelyn',    loves: ['Beet', 'Chocolate Cake', 'Diamond', 'Fairy Rose', 'Stuffed Eggplant', 'Tulip'] },
  { name: 'George',    loves: ['Fried Mushroom', 'Leek'] },
  { name: 'Gus',       loves: ['Diamond', 'Escargot', 'Fish Taco', 'Orange', 'Tropical Curry'] },
  { name: 'Haley',     loves: ['Coconut', 'Fruit Salad', 'Pink Cake', 'Sunflower'] },
  { name: 'Harvey',    loves: ['Coffee', 'Pickles', 'Super Meal', 'Truffle Oil', 'Wine'] },
  { name: 'Jas',       loves: ['Ancient Doll', 'Coconut', 'Fairy Rose', 'Pink Cake', 'Plum Pudding'] },
  { name: 'Jodi',      loves: ['Chocolate Cake', 'Crispy Bass', 'Diamond', 'Eggplant Parmesan', 'Fried Eel', 'Pancakes', 'Rhubarb Pie', 'Vegetable Medley'] },
  { name: 'Kent',      loves: ['Fiddlehead Risotto', 'Roasted Hazelnuts'] },
  { name: 'Krobus',    loves: ['Diamond', 'Iridium Bar', 'Pumpkin', 'Void Egg', 'Void Mayonnaise', 'Wild Horseradish'] },
  { name: 'Leah',      loves: ['Goat Cheese', 'Poppyseed Muffin', 'Salad', 'Stir Fry', 'Truffle', 'Vegetable Medley', 'Wine'] },
  { name: 'Leo',       loves: ['Dried Starfish', 'Duck Feather', 'Mango', 'Ostrich Egg', 'Poi'] },
  { name: 'Lewis',     loves: ["Autumn's Bounty", 'Glazed Yams', 'Hot Pepper', 'Vegetable Medley', 'Yam'] },
  { name: 'Linus',     loves: ['Blueberry Tart', 'Cactus Fruit', 'Coconut', "Dish O' The Sea", 'Yam'] },
  { name: 'Marnie',    loves: ['Diamond', "Farmer's Lunch", 'Pink Cake', 'Pumpkin Pie'] },
  { name: 'Pam',       loves: ['Beer', 'Cactus Fruit', 'Glazed Yams', "Miner's Treat", 'Pale Ale', 'Parsnip Soup'] },
  { name: 'Penny',     loves: ['Diamond', 'Emerald', 'Melon', 'Poppy', 'Red Plate', 'Roots Platter', 'Sandfish', 'Tom Kha Soup'] },
  { name: 'Pierre',    loves: ['Fried Calamari', 'Strawberry'] },
  { name: 'Robin',     loves: ['Goat Cheese', 'Peach', 'Spaghetti'] },
  { name: 'Sam',       loves: ['Cactus Fruit', 'Maple Bar', 'Pizza', 'Tigerseye'] },
  { name: 'Sandy',     loves: ['Crocus', 'Daffodil', 'Mango Sticky Rice', 'Sweet Pea'] },
  { name: 'Sebastian', loves: ['Frozen Tear', 'Pumpkin Soup', 'Sashimi', 'Void Egg'] },
  { name: 'Shane',     loves: ['Beer', 'Hot Pepper', 'Pepper Poppers', 'Pizza'] },
  { name: 'Vincent',   loves: ['Cranberry Candy', 'Ginger Ale', 'Grape', 'Pink Cake', 'Snail'] },
  { name: 'Willy',     loves: ['Catfish', 'Diamond', 'Iridium Bar', 'Mead', 'Octopus', 'Pumpkin', 'Sea Cucumber', 'Sturgeon'] },
  { name: 'Wizard',    loves: ['Purple Mushroom', 'Solar Essence', 'Super Cucumber', 'Void Essence'] },
]

// ── component ──────────────────────────────────────────────────────────────────

export default function GiftsPage() {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const filtered = q
    ? VILLAGERS.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.loves.some((g) => g.toLowerCase().includes(q)),
      )
    : VILLAGERS

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ink">Gifts</h2>
        <p className="text-muted text-sm mt-1">What every villager loves. Search by name or item.</p>
      </div>

      {/* Universal loves */}
      <div className="mb-5 bg-cream-dark rounded-xl px-4 py-3 flex items-start gap-3">
        <Star size={14} className="text-brown mt-0.5 flex-shrink-0" strokeWidth={1.75} />
        <div>
          <p className="text-xs font-semibold text-ink mb-1.5">Everyone loves these</p>
          <div className="flex flex-wrap gap-1.5">
            {UNIVERSAL_LOVES.map((g) => (
              <span key={g} className="text-[10px] bg-brown/10 text-brown px-2 py-0.5 rounded-full font-medium">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search villager or gift…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-parchment rounded-xl bg-white text-ink placeholder:text-muted focus:outline-none focus:border-brown"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted text-center py-10">No results for "{query}"</p>
      )}

      {/* Villager grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(({ name, loves }) => {
          const sprite = villagerSprite(name)
          return (
            <div
              key={name}
              className="bg-white border border-parchment rounded-2xl p-4 hover:border-brown-pale transition-all"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex items-start gap-3">
                {sprite && (
                  <img
                    src={sprite}
                    alt={name}
                    width={32}
                    style={{ imageRendering: 'pixelated', flexShrink: 0, marginTop: 1 }}
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink mb-2">{name}</p>
                  <div className="flex flex-wrap gap-1">
                    {loves.map((g) => {
                      const isMatch = q && g.toLowerCase().includes(q)
                      return (
                        <span
                          key={g}
                          className={`text-[10px] px-2 py-0.5 rounded-full leading-tight transition-colors ${
                            isMatch
                              ? 'bg-brown/15 text-brown font-semibold'
                              : 'bg-cream-dark text-ink'
                          }`}
                        >
                          {g}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

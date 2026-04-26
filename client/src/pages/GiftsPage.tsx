import { useState } from 'react'
import { Search, Heart, ThumbsUp, ThumbsDown, X } from 'lucide-react'
import { villagerSprite } from '../data/sprites'

// ── data ──────────────────────────────────────────────────────────────────────

const UNIVERSAL = {
  loves:    ['Golden Pumpkin', 'Magic Rock Candy', 'Pearl', 'Prismatic Shard', "Rabbit's Foot"],
  likes:    ['Artisan goods', 'Cooked dishes', 'Flowers', 'Fruit', 'Gems'],
  dislikes: ['Fiber', 'Sap', 'Mixed Seeds', 'Cave Carrot', 'Bait', 'Bombs', 'Fishing Tackle'],
  hates:    ['Trash', 'Joja Cola', 'Broken CD', 'Broken Glasses', 'Driftwood', 'Soggy Newspaper'],
}

interface VG {
  name: string
  loves: string[]
  likesExtra?: string[]
  dislikesExtra?: string[]
  hatesExtra?: string[]
}

const VILLAGERS: VG[] = [
  { name: 'Abigail',   loves: ['Amethyst', 'Blackberry Cobbler', 'Chocolate Cake', 'Pufferfish', 'Pumpkin', 'Spicy Eel'] },
  { name: 'Alex',      loves: ['Complete Breakfast', 'Salmon Dinner'],                         likesExtra: ['Kale'] },
  { name: 'Caroline',  loves: ['Summer Spangle', 'Tropical Curry'],                            likesExtra: ['Green Tea'] },
  { name: 'Clint',     loves: ['Artichoke Dip', 'Fiddlehead Risotto', 'Gold Bar', 'Iridium Bar', 'Omni Geode'],
                        likesExtra: ['Copper Bar', 'Iron Bar', 'Gold Bar'] },
  { name: 'Demetrius', loves: ['Bean Hotpot', 'Ice Cream', 'Rice Pudding', 'Strawberry'],     likesExtra: ['Egg', 'Milk'] },
  { name: 'Dwarf',     loves: ['Amethyst', 'Aquamarine', 'Emerald', 'Iridium Bar', 'Jade', 'Omni Geode', 'Ruby', 'Topaz'] },
  { name: 'Elliott',   loves: ['Crab Cakes', 'Duck Feather', 'Lobster', 'Pomegranate', 'Tom Kha Soup'],
                        likesExtra: ['Squid Ink', 'Octopus'] },
  { name: 'Emily',     loves: ['Amethyst', 'Aquamarine', 'Cloth', 'Emerald', 'Jade', 'Ruby', 'Survival Burger', 'Topaz', 'Wool'] },
  { name: 'Evelyn',    loves: ['Beet', 'Chocolate Cake', 'Diamond', 'Fairy Rose', 'Stuffed Eggplant', 'Tulip'],
                        likesExtra: ['Bok Choy', 'Leek', 'Parsnip'] },
  { name: 'George',    loves: ['Fried Mushroom', 'Leek'],                                     likesExtra: ['Daffodil'] },
  { name: 'Gus',       loves: ['Diamond', 'Escargot', 'Fish Taco', 'Orange', 'Tropical Curry'],
                        likesExtra: ['Beer', 'Daffodil'] },
  { name: 'Haley',     loves: ['Coconut', 'Fruit Salad', 'Pink Cake', 'Sunflower'],           dislikesExtra: ['Prismatic Shard'] },
  { name: 'Harvey',    loves: ['Coffee', 'Pickles', 'Super Meal', 'Truffle Oil', 'Wine'],     likesExtra: ['Salad', 'Tom Kha Soup'] },
  { name: 'Jas',       loves: ['Ancient Doll', 'Coconut', 'Fairy Rose', 'Pink Cake', 'Plum Pudding'] },
  { name: 'Jodi',      loves: ['Chocolate Cake', 'Crispy Bass', 'Diamond', 'Eggplant Parmesan', 'Fried Eel', 'Pancakes', 'Rhubarb Pie', 'Vegetable Medley'] },
  { name: 'Kent',      loves: ['Fiddlehead Risotto', 'Roasted Hazelnuts'],                   likesExtra: ['Salmonberry', 'Cactus Fruit'] },
  { name: 'Krobus',    loves: ['Diamond', 'Iridium Bar', 'Pumpkin', 'Void Egg', 'Void Mayonnaise', 'Wild Horseradish'],
                        likesExtra: ['Quartz', 'All Monster Loot'] },
  { name: 'Leah',      loves: ['Goat Cheese', 'Poppyseed Muffin', 'Salad', 'Stir Fry', 'Truffle', 'Vegetable Medley', 'Wine'],
                        dislikesExtra: ['Bread', 'Pizza'] },
  { name: 'Leo',       loves: ['Dried Starfish', 'Duck Feather', 'Mango', 'Ostrich Egg', 'Poi'] },
  { name: 'Lewis',     loves: ["Autumn's Bounty", 'Glazed Yams', 'Hot Pepper', 'Vegetable Medley', 'Yam'] },
  { name: 'Linus',     loves: ['Blueberry Tart', 'Cactus Fruit', 'Coconut', "Dish O' The Sea", 'Yam'],
                        dislikesExtra: ['Salad'] },
  { name: 'Marnie',    loves: ['Diamond', "Farmer's Lunch", 'Pink Cake', 'Pumpkin Pie'],     likesExtra: ['Egg', 'Milk', 'Cheese'] },
  { name: 'Pam',       loves: ['Beer', 'Cactus Fruit', 'Glazed Yams', "Miner's Treat", 'Pale Ale', 'Parsnip Soup'] },
  { name: 'Penny',     loves: ['Diamond', 'Emerald', 'Melon', 'Poppy', 'Red Plate', 'Roots Platter', 'Sandfish', 'Tom Kha Soup'],
                        dislikesExtra: ['Beer', 'Pale Ale', 'Mead', 'Wine'],
                        hatesExtra: ['Joja Cola'] },
  { name: 'Pierre',    loves: ['Fried Calamari', 'Strawberry'],                              likesExtra: ['Daffodil', 'Dandelion'] },
  { name: 'Robin',     loves: ['Goat Cheese', 'Peach', 'Spaghetti'],                         likesExtra: ['Hardwood'] },
  { name: 'Sam',       loves: ['Cactus Fruit', 'Maple Bar', 'Pizza', 'Tigerseye'],           likesExtra: ['Joja Cola', 'Pancakes'] },
  { name: 'Sandy',     loves: ['Crocus', 'Daffodil', 'Mango Sticky Rice', 'Sweet Pea'],      likesExtra: ['Cactus Fruit', 'Coconut'] },
  { name: 'Sebastian', loves: ['Frozen Tear', 'Pumpkin Soup', 'Sashimi', 'Void Egg'],        dislikesExtra: ['Salad', 'Complete Breakfast'] },
  { name: 'Shane',     loves: ['Beer', 'Hot Pepper', 'Pepper Poppers', 'Pizza'],             likesExtra: ['Egg', 'Hashbrowns'] },
  { name: 'Vincent',   loves: ['Cranberry Candy', 'Ginger Ale', 'Grape', 'Pink Cake', 'Snail'] },
  { name: 'Willy',     loves: ['Catfish', 'Diamond', 'Iridium Bar', 'Mead', 'Octopus', 'Pumpkin', 'Sea Cucumber', 'Sturgeon'],
                        likesExtra: ['Most Fish', 'Crab Cakes'] },
  { name: 'Wizard',    loves: ['Purple Mushroom', 'Solar Essence', 'Super Cucumber', 'Void Essence'],
                        likesExtra: ['All Geodes', 'All Monster Loot'] },
]

// ── sub-components ─────────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  label,
  color,
  bg,
  pills,
  note,
}: {
  icon: React.ElementType
  label: string
  color: string
  bg: string
  pills?: string[]
  note?: string
}) {
  if (!pills?.length && !note) return null
  return (
    <div className={`px-4 py-3 ${bg} border-t border-parchment/60`}>
      <p className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide ${color} mb-2`}>
        <Icon size={11} strokeWidth={2.5} />
        {label}
      </p>
      {note && <p className="text-[10px] text-muted mb-1.5 leading-snug">{note}</p>}
      {!!pills?.length && (
        <div className="flex flex-wrap gap-1">
          {pills.map((p) => (
            <span key={p} className={`text-[10px] px-2 py-0.5 rounded-full leading-tight ${color} bg-white/60 border border-current/20`}>
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── component ──────────────────────────────────────────────────────────────────

export default function GiftsPage() {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const filtered = q
    ? VILLAGERS.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.loves.some((g) => g.toLowerCase().includes(q)) ||
          v.likesExtra?.some((g) => g.toLowerCase().includes(q)),
      )
    : VILLAGERS

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ink">Gifts</h2>
        <p className="text-muted text-sm mt-1">What every villager loves, likes, and dislikes.</p>
      </div>

      {/* Universal section */}
      <div className="mb-6 bg-white border border-parchment rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="px-4 py-3 bg-cream-dark border-b border-parchment">
          <p className="text-xs font-semibold text-ink">Universal — applies to everyone</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-parchment">
          {[
            { label: 'Loves',    Icon: Heart,      color: 'text-fall',   items: UNIVERSAL.loves },
            { label: 'Likes',    Icon: ThumbsUp,   color: 'text-green',  items: UNIVERSAL.likes },
            { label: 'Dislikes', Icon: ThumbsDown, color: 'text-summer', items: UNIVERSAL.dislikes },
            { label: 'Hates',    Icon: X,          color: 'text-muted',  items: UNIVERSAL.hates },
          ].map(({ label, Icon, color, items }) => (
            <div key={label} className="p-3">
              <p className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide ${color} mb-2`}>
                <Icon size={10} strokeWidth={2.5} />{label}
              </p>
              <div className="flex flex-col gap-0.5">
                {items.map((i) => (
                  <span key={i} className="text-[10px] text-muted leading-snug">{i}</span>
                ))}
              </div>
            </div>
          ))}
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

      {/* Villager cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(({ name, loves, likesExtra, dislikesExtra, hatesExtra }) => {
          const sprite = villagerSprite(name)
          return (
            <div
              key={name}
              className="bg-white border border-parchment rounded-2xl overflow-hidden hover:border-brown-pale transition-all"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-parchment">
                {sprite && (
                  <img
                    src={sprite}
                    alt={name}
                    width={36}
                    style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                    referrerPolicy="no-referrer"
                  />
                )}
                <p className="font-semibold text-ink">{name}</p>
              </div>

              {/* Loves */}
              <div className="px-4 py-3 bg-fall/5 border-b border-parchment/60">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-fall mb-2">
                  <Heart size={11} strokeWidth={2.5} /> Loves
                </p>
                <div className="flex flex-wrap gap-1">
                  {loves.map((g) => {
                    const isMatch = q && g.toLowerCase().includes(q)
                    return (
                      <span
                        key={g}
                        className={`text-[11px] px-2 py-0.5 rounded-full leading-tight transition-colors ${
                          isMatch ? 'bg-brown text-cream font-semibold' : 'bg-fall/10 text-fall'
                        }`}
                      >
                        {g}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Likes */}
              <Section
                icon={ThumbsUp}
                label="Likes"
                color="text-green"
                bg="bg-spring/5"
                note="Artisan goods · Flowers · Gems · Fruit · Cooked dishes"
                pills={likesExtra?.map((g) => {
                  return g
                })}
              />

              {/* Dislikes */}
              <Section
                icon={ThumbsDown}
                label="Dislikes"
                color="text-summer"
                bg="bg-summer/5"
                note={!dislikesExtra?.length ? 'Fiber · Sap · Bait · Bombs · Basic junk' : undefined}
                pills={dislikesExtra}
              />

              {/* Hates */}
              <Section
                icon={X}
                label="Hates"
                color="text-muted"
                bg=""
                note={!hatesExtra?.length ? 'Trash · Joja Cola · Broken items' : undefined}
                pills={hatesExtra}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Leaf } from 'lucide-react'
import type { Season } from '@shared'
import { useAppStore } from '../store/useAppStore'
import { foragingSprite } from '../data/sprites'

// ── data ──────────────────────────────────────────────────────────────────────

interface ForageItem {
  name: string
  sellPrice: number
  locations: string[]
  note?: string
}

const FORAGE: Record<Season, ForageItem[]> = {
  spring: [
    {
      name: 'Wild Horseradish',
      sellPrice: 50,
      locations: ['Farm', 'Cindersap Forest'],
      note: 'One of the first items available. Good early sell for quick gold.',
    },
    {
      name: 'Daffodil',
      sellPrice: 30,
      locations: ['Farm', 'Pelican Town', 'Cindersap Forest'],
      note: 'A loved gift for Evelyn and Leah. Keep a few for gifting.',
    },
    {
      name: 'Leek',
      sellPrice: 60,
      locations: ['Farm', 'Cindersap Forest'],
    },
    {
      name: 'Dandelion',
      sellPrice: 40,
      locations: ['Farm', 'Pelican Town', 'Cindersap Forest'],
      note: "Needed for the Spring Foraging Bundle. Leah's favourite gift.",
    },
    {
      name: 'Spring Onion',
      sellPrice: 8,
      locations: ['Cindersap Forest (south)'],
      note: 'Spawns in a patch near the southern pond — up to 6 per day. Very low sell price but great for early Fiber Fertilizer.',
    },
    {
      name: 'Salmonberry',
      sellPrice: 5,
      locations: ['Bushes — everywhere'],
      note: 'Bush foraging only, Spring 15–18 (Salmonberry Season). Each bush gives 1–3 berries. Good for energy early on — sell price is negligible.',
    },
  ],
  summer: [
    {
      name: 'Grape',
      sellPrice: 80,
      locations: ['Farm', 'Cindersap Forest'],
      note: 'Also a crop (harvestable every 3 days after Fall 1). Wild grapes count for the Summer Foraging Bundle.',
    },
    {
      name: 'Spice Berry',
      sellPrice: 80,
      locations: ['Farm', 'Cindersap Forest', 'Bus Stop'],
    },
    {
      name: 'Sweet Pea',
      sellPrice: 50,
      locations: ['Farm', 'Cindersap Forest', 'Bus Stop'],
      note: "A loved gift for Haley, Leah, and Sandra.",
    },
    {
      name: 'Fiddlehead Fern',
      sellPrice: 90,
      locations: ['Secret Woods'],
      note: 'Only spawns in Secret Woods (requires Copper Axe to unlock). Sells for 90g raw, 270g pickled, 380g as Fiddlehead Risotto.',
    },
    {
      name: 'Red Mushroom',
      sellPrice: 75,
      locations: ['Cindersap Forest', 'Secret Woods'],
      note: 'Also appears in Fall. Rare spawn — prioritize when you see it.',
    },
  ],
  fall: [
    {
      name: 'Common Mushroom',
      sellPrice: 90,
      locations: ['Cindersap Forest', 'Secret Woods'],
      note: 'High spawn rate in Fall. Excellent foraging income — 135g at Gold quality.',
    },
    {
      name: 'Wild Plum',
      sellPrice: 80,
      locations: ['Farm', 'Cindersap Forest', 'Bus Stop'],
    },
    {
      name: 'Hazelnut',
      sellPrice: 90,
      locations: ['Farm', 'Cindersap Forest', 'Bus Stop', 'Railroad'],
    },
    {
      name: 'Blackberry',
      sellPrice: 20,
      locations: ['Bushes — everywhere'],
      note: 'Bush foraging only, Fall 8–11 (Blackberry Season). Each bush yields 1–3 berries. Stock up for energy and gifting.',
    },
    {
      name: 'Chanterelle',
      sellPrice: 160,
      locations: ['Cindersap Forest', 'Secret Woods'],
      note: 'Highest base sell price of any seasonal forageable (240g Gold, 320g Iridium). Prioritize Secret Woods sweeps in Fall.',
    },
    {
      name: 'Red Mushroom',
      sellPrice: 75,
      locations: ['Cindersap Forest', 'Secret Woods'],
    },
    {
      name: 'Holly',
      sellPrice: 80,
      locations: ['Farm', 'Bus Stop', 'Cindersap Forest'],
      note: 'Also appears in Winter. Not used in bundles but decent sell price.',
    },
  ],
  winter: [
    {
      name: 'Crystal Fruit',
      sellPrice: 150,
      locations: ['Farm', 'Bus Stop', 'Cindersap Forest'],
      note: 'Second highest base sell price in Winter. Loved gift for Abigail.',
    },
    {
      name: 'Holly',
      sellPrice: 80,
      locations: ['Farm', 'Bus Stop', 'Cindersap Forest'],
    },
    {
      name: 'Crocus',
      sellPrice: 60,
      locations: ['Farm', 'Cindersap Forest', 'Bus Stop'],
      note: 'Loved by Evelyn. Keep a few for gifting before selling.',
    },
    {
      name: 'Nautilus Shell',
      sellPrice: 120,
      locations: ['Beach'],
      note: 'Beach-exclusive in Winter. Walk the beach every morning — up to 3 can spawn.',
    },
    {
      name: 'Winter Root',
      sellPrice: 70,
      locations: ['Artifact spots'],
      note: 'Dig artifact spots (wormy ground) on the Farm, Forest, Bus Stop, or Mountain. Counts for Winter Foraging Bundle.',
    },
    {
      name: 'Snow Yam',
      sellPrice: 100,
      locations: ['Artifact spots'],
      note: 'Also from artifact spots. Loved by Jas and Vincent.',
    },
  ],
}

const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_TAB: Record<Season, { active: string }> = {
  spring: { active: 'bg-spring/10 text-spring' },
  summer: { active: 'bg-summer/10 text-summer' },
  fall:   { active: 'bg-fall/10 text-fall' },
  winter: { active: 'bg-winter/10 text-winter' },
}

// ── component ──────────────────────────────────────────────────────────────────

export default function ForagingPage() {
  const { currentSeason } = useAppStore()
  const [tab, setTab] = useState<Season>(currentSeason)

  const items = FORAGE[tab]

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="mb-7">
        <h2 className="text-2xl font-semibold text-ink">Foraging</h2>
        <p className="text-muted text-sm mt-1">Wild items by season — where to find them and what they sell for.</p>
      </div>

      {/* Season tabs */}
      <div className="flex gap-1.5 mb-6 bg-cream-dark rounded-2xl p-1">
        {SEASONS.map((s) => (
          <button
            key={s}
            onClick={() => setTab(s)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
              tab === s
                ? `${SEASON_TAB[s].active} shadow-sm`
                : 'text-muted hover:text-ink'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Botanist callout */}
      <div className="mb-5 bg-cream-dark rounded-xl px-4 py-3 flex items-start gap-3">
        <Leaf size={14} className="text-green mt-0.5 flex-shrink-0" strokeWidth={1.75} />
        <p className="text-xs text-muted leading-snug">
          <span className="font-semibold text-ink">Botanist</span> (Foraging Lv 10) makes every foraged item Iridium quality — roughly 2× the base sell price shown below.
        </p>
      </div>

      {/* Item list */}
      <div className="space-y-3">
        {items.map(({ name, sellPrice, locations, note }) => (
          <div
            key={name}
            className="bg-white border border-parchment rounded-2xl p-4 hover:border-brown-pale transition-all"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-start gap-3">

              {foragingSprite(name) && (
                <img
                  src={foragingSprite(name)!}
                  alt={name}
                  width={28}
                  height={28}
                  style={{ imageRendering: 'pixelated', flexShrink: 0, marginTop: 2 }}
                  referrerPolicy="no-referrer"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <p className="text-sm font-semibold text-ink">{name}</p>
                  <span className="text-[10px] bg-cream-dark text-muted px-1.5 py-0.5 rounded-full">
                    {sellPrice}g
                  </span>
                  <span className="text-[10px] bg-cream-dark text-muted px-1.5 py-0.5 rounded-full">
                    {sellPrice * 2}g iridium
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-1.5">
                  {locations.map((loc) => (
                    <span
                      key={loc}
                      className="text-[10px] bg-cream-dark text-ink px-2 py-0.5 rounded-full leading-tight"
                    >
                      {loc}
                    </span>
                  ))}
                </div>

                {note && (
                  <p className="text-[11px] text-brown/80 leading-snug border-l-2 border-brown/20 pl-2">
                    {note}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

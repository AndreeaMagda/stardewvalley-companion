import { Sprout, Wheat, Pickaxe, Heart, Clock, TrendingUp, type LucideIcon } from 'lucide-react'

const TIPS: { category: string; Icon: LucideIcon; items: string[] }[] = [
  {
    category: 'Early Game',
    Icon: Sprout,
    items: [
      "Clear your farm on Day 1 and immediately plant Parsnips — they're ready in 4 days and will give you money for Spring 2.",
      'Talk to everyone in town on Day 1 to trigger introductions and start building relationships.',
      'Pick up every forageable item you see — they\'re free money or gifts.',
      'Buy a Fishing Rod from Willy on Day 2 (500g Bamboo Rod). Fishing is the best early-game gold source.',
      'Upgrade your Backpack as soon as you have 2000g. The extra 12 slots are essential.',
    ],
  },
  {
    category: 'Farming',
    Icon: Wheat,
    items: [
      "Always water your crops every day — a missed day doesn't kill them but wastes time.",
      'Fertilizer increases crop quality. Save Fiber to craft Basic Fertilizer early on.',
      'Sprinklers are a huge quality-of-life upgrade. Copper Sprinkler requires Level 2 Farming.',
      "Buy seeds in bulk at the start of each season — Pierre's store closes on Festival days.",
      'Keg wine from Starfruit is the most profitable artisan good in the game (2250g base).',
      'Hops + Kegs = Pale Ale (300g). Easy to set up with a trellis.',
      'Coffee Beans regrow every 2 days and make excellent speed boosts (2 coffees = Tilled soil buff).',
    ],
  },
  {
    category: 'Mining & Combat',
    Icon: Pickaxe,
    items: [
      'Prioritize the Mines early — you need Copper for tools and Sprinklers.',
      'Bring food into the Mines. Fried Egg (easy to make) heals 50 HP.',
      'The Skull Key unlocks the Skull Cavern in the Desert — great for Iridium Ore.',
      'Bring lots of Bombs to the Skull Cavern to break through rock quickly.',
      'Geodes from mining contain Minerals needed for the Museum donation collection.',
    ],
  },
  {
    category: 'Relationships',
    Icon: Heart,
    items: [
      'Give everyone a gift twice per week (Mon–Sat) to build friendship hearts.',
      "Loved gifts are 8× more effective than regular gifts. Check each villager's loved gifts.",
      'Birthday gifts give 8× the normal points AND a loved/neutral/hated modifier. Always gift on birthdays.',
      'Talk to every villager every day — it gives a small friendship boost.',
      'Completing "Help Wanted" requests from the bulletin board gives 150g + 150 friendship points.',
    ],
  },
  {
    category: 'Time Management',
    Icon: Clock,
    items: [
      'Each in-game hour = 43 real seconds. A full day lasts about 14 minutes.',
      'You pass out at 2:00 AM and lose 10% of your gold (max 1000g). Get home before midnight.',
      'Eating food restores energy AND health. Cook meals to get buffs for mining/farming.',
      'The Greenhouse (Community Center or Joja) lets you grow any crop year-round.',
      'Speed-Gro fertilizer is worth the cost for slow crops like Cauliflower and Pumpkin.',
    ],
  },
  {
    category: 'Money Making',
    Icon: TrendingUp,
    items: [
      'Prioritize completing the Community Center bundles — they unlock the Greenhouse and other rewards.',
      'Truffles from Pigs sell for 625g base and make Truffle Oil (1491g) in an Oil Maker.',
      "Rabbit's Foot + Rarecrow set gives access to the Secret Note system.",
      'Ancient Fruit is the best passive crop — grows every 7 days in Greenhouse year-round (worth 2250g wine).',
      'Aged Casks in the Cellar double wine/cheese value. Silver → Gold → Iridium takes 14–56 days.',
    ],
  },
]

export default function TipsPage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <h2 className="text-2xl font-semibold text-ink mb-1">Tips & Guides</h2>
      <p className="text-muted text-sm mb-8">Useful knowledge for your farm life.</p>

      <div className="space-y-8">
        {TIPS.map(({ category, Icon, items }) => (
          <div key={category}>
            <h3 className="flex items-center gap-2.5 text-base font-semibold text-ink mb-3">
              <div className="w-7 h-7 rounded-lg bg-cream-dark flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-brown" strokeWidth={1.75} />
              </div>
              {category}
            </h3>
            <ul className="space-y-2">
              {items.map((tip, i) => (
                <li key={i} className="flex gap-3 bg-white border border-parchment rounded-xl px-5 py-3 text-sm text-ink leading-relaxed">
                  <span className="text-brown/60 mt-0.5 flex-shrink-0 font-bold">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

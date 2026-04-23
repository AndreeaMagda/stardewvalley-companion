export interface MineItem {
  name: string
  type: 'ore' | 'gem' | 'mineral' | 'fish' | 'geode'
  rarity: 'common' | 'uncommon' | 'rare' | 'very rare'
  sellPrice: number
}

export interface MineMilestone {
  floor: number
  label: string
  reward: string
}

export interface MineZone {
  id: string
  name: string
  floors: string
  floorStart: number
  floorEnd: number | null   // null = unlimited (Skull Cavern)
  theme: 'earth' | 'frost' | 'fire' | 'void'
  items: MineItem[]
  milestones: MineMilestone[]
}

export const MINE_ZONES: MineZone[] = [
  {
    id: 'earth',
    name: 'Earth Zone',
    floors: '1–39',
    floorStart: 1,
    floorEnd: 39,
    theme: 'earth',
    items: [
      { name: 'Copper Ore',    type: 'ore',     rarity: 'common',    sellPrice: 5   },
      { name: 'Coal',          type: 'ore',     rarity: 'uncommon',  sellPrice: 15  },
      { name: 'Stone',         type: 'ore',     rarity: 'common',    sellPrice: 2   },
      { name: 'Quartz',        type: 'mineral', rarity: 'uncommon',  sellPrice: 25  },
      { name: 'Earth Crystal', type: 'mineral', rarity: 'uncommon',  sellPrice: 50  },
      { name: 'Amethyst',      type: 'gem',     rarity: 'uncommon',  sellPrice: 100 },
      { name: 'Topaz',         type: 'gem',     rarity: 'uncommon',  sellPrice: 80  },
      { name: 'Geode',         type: 'geode',   rarity: 'common',    sellPrice: 50  },
      { name: 'Diamond',       type: 'gem',     rarity: 'very rare', sellPrice: 750 },
    ],
    milestones: [
      { floor: 5,  label: 'Treasure chest',    reward: 'Random item + Boots' },
      { floor: 10, label: 'Treasure chest',    reward: 'Random item + Boots' },
      { floor: 20, label: 'Ghostfish & Stonefish', reward: 'Can fish for Ghostfish / Stonefish in pools' },
      { floor: 40, label: 'Iron Zone begins',  reward: 'Iron Ore starts appearing regularly' },
    ],
  },
  {
    id: 'frost',
    name: 'Frost Zone',
    floors: '40–79',
    floorStart: 40,
    floorEnd: 79,
    theme: 'frost',
    items: [
      { name: 'Iron Ore',      type: 'ore',     rarity: 'common',    sellPrice: 10  },
      { name: 'Coal',          type: 'ore',     rarity: 'common',    sellPrice: 15  },
      { name: 'Frozen Tear',   type: 'mineral', rarity: 'uncommon',  sellPrice: 75  },
      { name: 'Jade',          type: 'gem',     rarity: 'uncommon',  sellPrice: 200 },
      { name: 'Aquamarine',    type: 'gem',     rarity: 'uncommon',  sellPrice: 180 },
      { name: 'Frozen Geode',  type: 'geode',   rarity: 'common',    sellPrice: 100 },
      { name: 'Diamond',       type: 'gem',     rarity: 'very rare', sellPrice: 750 },
    ],
    milestones: [
      { floor: 40, label: 'Frost zone starts',  reward: 'Iron Ore is now the primary ore' },
      { floor: 60, label: 'Ice Pip',             reward: 'Can fish for Ice Pip in pools' },
      { floor: 70, label: 'Treasure chest',      reward: 'Random item + Boots' },
      { floor: 80, label: 'Fire Zone begins',    reward: 'Gold Ore starts appearing regularly' },
    ],
  },
  {
    id: 'fire',
    name: 'Fire Zone',
    floors: '80–119',
    floorStart: 80,
    floorEnd: 119,
    theme: 'fire',
    items: [
      { name: 'Gold Ore',      type: 'ore',     rarity: 'common',    sellPrice: 25  },
      { name: 'Coal',          type: 'ore',     rarity: 'common',    sellPrice: 15  },
      { name: 'Fire Quartz',   type: 'mineral', rarity: 'uncommon',  sellPrice: 100 },
      { name: 'Ruby',          type: 'gem',     rarity: 'uncommon',  sellPrice: 250 },
      { name: 'Emerald',       type: 'gem',     rarity: 'uncommon',  sellPrice: 250 },
      { name: 'Magma Geode',   type: 'geode',   rarity: 'common',    sellPrice: 150 },
      { name: 'Diamond',       type: 'gem',     rarity: 'very rare', sellPrice: 750 },
    ],
    milestones: [
      { floor: 80,  label: 'Fire zone starts',  reward: 'Gold Ore is now the primary ore' },
      { floor: 90,  label: 'Treasure chest',     reward: 'Random item + Boots' },
      { floor: 100, label: 'Lava Eel',           reward: 'Can fish for Lava Eel in lava pools' },
      { floor: 120, label: 'Bottom of the Mines', reward: 'Skull Key — unlocks Skull Cavern & Witch\'s Hut' },
    ],
  },
  {
    id: 'skull',
    name: 'Skull Cavern',
    floors: '1+',
    floorStart: 1,
    floorEnd: null,
    theme: 'void',
    items: [
      { name: 'Iridium Ore',      type: 'ore',     rarity: 'uncommon',  sellPrice: 100  },
      { name: 'Gold Ore',         type: 'ore',     rarity: 'common',    sellPrice: 25   },
      { name: 'Radioactive Ore',  type: 'ore',     rarity: 'rare',      sellPrice: 300  },
      { name: 'Prismatic Shard',  type: 'gem',     rarity: 'very rare', sellPrice: 2000 },
      { name: 'Diamond',          type: 'gem',     rarity: 'rare',      sellPrice: 750  },
      { name: 'Omni Geode',       type: 'geode',   rarity: 'common',    sellPrice: 50   },
    ],
    milestones: [
      { floor: 10,  label: 'Deeper = more Iridium',  reward: 'Iridium Ore becomes more frequent below floor 10' },
      { floor: 100, label: 'Radioactive Ore zone',   reward: 'Radioactive Ore appears in large quantities' },
      { floor: 100, label: 'Prismatic Shard chance',  reward: 'Higher chance of Prismatic Shard in Iridium nodes' },
    ],
  },
]

// Flat lookup: which zone(s) does a given item appear in?
export function zonesForItem(itemName: string): MineZone[] {
  return MINE_ZONES.filter((z) => z.items.some((i) => i.name === itemName))
}

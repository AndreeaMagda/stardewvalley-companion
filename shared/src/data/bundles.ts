export interface BundleItem {
  id: string
  name: string
  quantity?: number
  quality?: 'silver' | 'gold'
}

export interface Bundle {
  id: string
  name: string
  reward: string
  items: BundleItem[]
  required?: number // if set, only need this many items (not all)
}

export interface BundleRoom {
  id: string
  name: string
  icon: string
  bundles: Bundle[]
}

export const BUNDLE_ROOMS: BundleRoom[] = [
  {
    id: 'pantry',
    name: 'Pantry',
    icon: '🌽',
    bundles: [
      {
        id: 'spring-crops',
        name: 'Spring Crops',
        reward: 'Speed-Gro ×20',
        items: [
          { id: 'parsnip',    name: 'Parsnip' },
          { id: 'green-bean', name: 'Green Bean' },
          { id: 'cauliflower',name: 'Cauliflower' },
          { id: 'potato',     name: 'Potato' },
        ],
      },
      {
        id: 'summer-crops',
        name: 'Summer Crops',
        reward: 'Quality Sprinkler',
        items: [
          { id: 'tomato',     name: 'Tomato' },
          { id: 'hot-pepper', name: 'Hot Pepper' },
          { id: 'blueberry',  name: 'Blueberry' },
          { id: 'melon',      name: 'Melon' },
        ],
      },
      {
        id: 'fall-crops',
        name: 'Fall Crops',
        reward: 'Bee House',
        items: [
          { id: 'corn',     name: 'Corn' },
          { id: 'eggplant', name: 'Eggplant' },
          { id: 'pumpkin',  name: 'Pumpkin' },
          { id: 'yam',      name: 'Yam' },
        ],
      },
      {
        id: 'quality-crops',
        name: 'Quality Crops',
        reward: 'Preserves Jar',
        items: [
          { id: 'parsnip-gold', name: 'Parsnip', quantity: 5, quality: 'gold' },
          { id: 'melon-gold',   name: 'Melon',   quantity: 5, quality: 'gold' },
          { id: 'pumpkin-gold', name: 'Pumpkin', quantity: 5, quality: 'gold' },
          { id: 'corn-gold',    name: 'Corn',    quantity: 5, quality: 'gold' },
        ],
      },
      {
        id: 'animal',
        name: 'Animal',
        reward: 'Cheese Press',
        items: [
          { id: 'large-milk',      name: 'Large Milk' },
          { id: 'egg',             name: 'Egg' },
          { id: 'large-egg',       name: 'Large Egg' },
          { id: 'large-goat-milk', name: 'Large Goat Milk' },
          { id: 'wool',            name: 'Wool' },
          { id: 'duck-egg',        name: 'Duck Egg' },
        ],
      },
      {
        id: 'artisan',
        name: 'Artisan',
        reward: 'Keg',
        required: 6,
        items: [
          { id: 'truffle-oil', name: 'Truffle Oil' },
          { id: 'cloth',       name: 'Cloth' },
          { id: 'goat-cheese', name: 'Goat Cheese' },
          { id: 'cheese',      name: 'Cheese' },
          { id: 'honey',       name: 'Honey' },
          { id: 'jelly',       name: 'Jelly' },
          { id: 'apple',       name: 'Apple' },
          { id: 'apricot',     name: 'Apricot' },
          { id: 'orange',      name: 'Orange' },
          { id: 'peach',       name: 'Peach' },
          { id: 'pomegranate', name: 'Pomegranate' },
          { id: 'cherry',      name: 'Cherry' },
        ],
      },
    ],
  },
  {
    id: 'crafts-room',
    name: 'Crafts Room',
    icon: '🌿',
    bundles: [
      {
        id: 'spring-foraging',
        name: 'Spring Foraging',
        reward: 'Spring Seeds ×30',
        items: [
          { id: 'wild-horseradish', name: 'Wild Horseradish' },
          { id: 'daffodil',         name: 'Daffodil' },
          { id: 'leek',             name: 'Leek' },
          { id: 'dandelion',        name: 'Dandelion' },
        ],
      },
      {
        id: 'summer-foraging',
        name: 'Summer Foraging',
        reward: 'Summer Seeds ×30',
        items: [
          { id: 'grape',       name: 'Grape' },
          { id: 'spice-berry', name: 'Spice Berry' },
          { id: 'sweet-pea',   name: 'Sweet Pea' },
        ],
      },
      {
        id: 'fall-foraging',
        name: 'Fall Foraging',
        reward: 'Fall Seeds ×30',
        items: [
          { id: 'common-mushroom', name: 'Common Mushroom' },
          { id: 'wild-plum',       name: 'Wild Plum' },
          { id: 'hazelnut',        name: 'Hazelnut' },
          { id: 'blackberry',      name: 'Blackberry' },
        ],
      },
      {
        id: 'winter-foraging',
        name: 'Winter Foraging',
        reward: 'Winter Seeds ×30',
        items: [
          { id: 'winter-root',   name: 'Winter Root' },
          { id: 'crystal-fruit', name: 'Crystal Fruit' },
          { id: 'snow-yam',      name: 'Snow Yam' },
          { id: 'crocus',        name: 'Crocus' },
        ],
      },
      {
        id: 'construction',
        name: 'Construction',
        reward: 'Charcoal Kiln',
        items: [
          { id: 'wood',     name: 'Wood',     quantity: 99 },
          { id: 'stone',    name: 'Stone',    quantity: 99 },
          { id: 'hardwood', name: 'Hardwood', quantity: 10 },
        ],
      },
      {
        id: 'exotic-foraging',
        name: 'Exotic Foraging',
        reward: "Autumn's Bounty ×5",
        items: [
          { id: 'coconut',        name: 'Coconut' },
          { id: 'cactus-fruit',   name: 'Cactus Fruit' },
          { id: 'cave-carrot',    name: 'Cave Carrot' },
          { id: 'red-mushroom',   name: 'Red Mushroom' },
          { id: 'purple-mushroom',name: 'Purple Mushroom' },
          { id: 'maple-syrup',    name: 'Maple Syrup' },
          { id: 'oak-resin',      name: 'Oak Resin' },
          { id: 'pine-tar',       name: 'Pine Tar' },
          { id: 'morel',          name: 'Morel' },
        ],
      },
    ],
  },
  {
    id: 'fish-tank',
    name: 'Fish Tank',
    icon: '🐟',
    bundles: [
      {
        id: 'river-fish',
        name: 'River Fish',
        reward: 'Bait ×30',
        items: [
          { id: 'sunfish',     name: 'Sunfish' },
          { id: 'catfish',     name: 'Catfish' },
          { id: 'shad',        name: 'Shad' },
          { id: 'tiger-trout', name: 'Tiger Trout' },
        ],
      },
      {
        id: 'lake-fish',
        name: 'Lake Fish',
        reward: 'Dressed Spinner',
        items: [
          { id: 'largemouth-bass', name: 'Largemouth Bass' },
          { id: 'carp',            name: 'Carp' },
          { id: 'bullhead',        name: 'Bullhead' },
          { id: 'sturgeon',        name: 'Sturgeon' },
        ],
      },
      {
        id: 'ocean-fish',
        name: 'Ocean Fish',
        reward: 'Warp Totem: Beach ×5',
        items: [
          { id: 'sardine',     name: 'Sardine' },
          { id: 'tuna',        name: 'Tuna' },
          { id: 'red-snapper', name: 'Red Snapper' },
          { id: 'tilapia',     name: 'Tilapia' },
        ],
      },
      {
        id: 'night-fishing',
        name: 'Night Fishing',
        reward: 'Small Glow Ring',
        items: [
          { id: 'walleye', name: 'Walleye' },
          { id: 'bream',   name: 'Bream' },
          { id: 'eel',     name: 'Eel' },
        ],
      },
      {
        id: 'specialty-fish',
        name: 'Specialty Fish',
        reward: "Dish O' The Sea",
        items: [
          { id: 'pufferfish', name: 'Pufferfish' },
          { id: 'ghostfish',  name: 'Ghostfish' },
          { id: 'sandfish',   name: 'Sandfish' },
          { id: 'woodskip',   name: 'Woodskip' },
        ],
      },
      {
        id: 'crab-pot',
        name: 'Crab Pot',
        reward: 'Crab Pot ×3',
        items: [
          { id: 'lobster',    name: 'Lobster' },
          { id: 'crayfish',   name: 'Crayfish' },
          { id: 'crab',       name: 'Crab' },
          { id: 'cockle',     name: 'Cockle' },
          { id: 'mussel',     name: 'Mussel' },
          { id: 'shrimp',     name: 'Shrimp' },
          { id: 'snail',      name: 'Snail' },
          { id: 'periwinkle', name: 'Periwinkle' },
          { id: 'oyster',     name: 'Oyster' },
          { id: 'clam',       name: 'Clam' },
        ],
      },
    ],
  },
  {
    id: 'boiler-room',
    name: 'Boiler Room',
    icon: '⚒️',
    bundles: [
      {
        id: 'blacksmiths',
        name: "Blacksmith's",
        reward: 'Furnace',
        items: [
          { id: 'copper-bar', name: 'Copper Bar' },
          { id: 'iron-bar',   name: 'Iron Bar' },
          { id: 'gold-bar',   name: 'Gold Bar' },
        ],
      },
      {
        id: 'geologists',
        name: "Geologist's",
        reward: 'Bomb ×5',
        items: [
          { id: 'quartz',        name: 'Quartz' },
          { id: 'earth-crystal', name: 'Earth Crystal' },
          { id: 'frozen-tear',   name: 'Frozen Tear' },
          { id: 'fire-quartz',   name: 'Fire Quartz' },
        ],
      },
      {
        id: 'adventurers',
        name: "Adventurer's",
        reward: 'Small Magnet Ring',
        items: [
          { id: 'slime',        name: 'Slime',        quantity: 99 },
          { id: 'bat-wing',     name: 'Bat Wing',     quantity: 10 },
          { id: 'solar-essence',name: 'Solar Essence' },
          { id: 'void-essence', name: 'Void Essence' },
        ],
      },
    ],
  },
  {
    id: 'bulletin-board',
    name: 'Bulletin Board',
    icon: '📋',
    bundles: [
      {
        id: 'chefs',
        name: "Chef's",
        reward: 'Pumpkin Soup',
        items: [
          { id: 'maple-syrup',     name: 'Maple Syrup' },
          { id: 'fiddlehead-fern', name: 'Fiddlehead Fern' },
          { id: 'truffle',         name: 'Truffle' },
          { id: 'poppy',           name: 'Poppy' },
          { id: 'maki-roll',       name: 'Maki Roll' },
          { id: 'fried-egg',       name: 'Fried Egg' },
        ],
      },
      {
        id: 'dye',
        name: 'Dye',
        reward: 'Seed Maker',
        items: [
          { id: 'red-mushroom', name: 'Red Mushroom' },
          { id: 'sea-urchin',   name: 'Sea Urchin' },
          { id: 'sunflower',    name: 'Sunflower' },
          { id: 'duck-feather', name: 'Duck Feather' },
          { id: 'aquamarine',   name: 'Aquamarine' },
          { id: 'red-cabbage',  name: 'Red Cabbage' },
        ],
      },
      {
        id: 'field-research',
        name: 'Field Research',
        reward: 'Recycling Machine',
        items: [
          { id: 'purple-mushroom', name: 'Purple Mushroom' },
          { id: 'nautilus-shell',  name: 'Nautilus Shell' },
          { id: 'chub',            name: 'Chub' },
          { id: 'frozen-geode',    name: 'Frozen Geode' },
        ],
      },
      {
        id: 'fodder',
        name: 'Fodder',
        reward: 'Heater',
        items: [
          { id: 'wheat', name: 'Wheat', quantity: 10 },
          { id: 'hay',   name: 'Hay',   quantity: 10 },
          { id: 'apple', name: 'Apple' },
        ],
      },
      {
        id: 'enchanters',
        name: "Enchanter's",
        reward: 'Loom',
        items: [
          { id: 'oak-resin',     name: 'Oak Resin' },
          { id: 'wine',          name: 'Wine' },
          { id: 'rabbits-foot',  name: "Rabbit's Foot" },
          { id: 'pomegranate',   name: 'Pomegranate' },
        ],
      },
    ],
  },
  {
    id: 'vault',
    name: 'Vault',
    icon: '💰',
    bundles: [
      {
        id: 'vault-2500',
        name: '2,500g',
        reward: 'Bridge repair',
        items: [{ id: 'gold-2500', name: '2,500g donation' }],
      },
      {
        id: 'vault-5000',
        name: '5,000g',
        reward: 'Glittering Boulder removal',
        items: [{ id: 'gold-5000', name: '5,000g donation' }],
      },
      {
        id: 'vault-10000',
        name: '10,000g',
        reward: 'Bus repair',
        items: [{ id: 'gold-10000', name: '10,000g donation' }],
      },
      {
        id: 'vault-25000',
        name: '25,000g',
        reward: 'Minecarts repair',
        items: [{ id: 'gold-25000', name: '25,000g donation' }],
      },
    ],
  },
]

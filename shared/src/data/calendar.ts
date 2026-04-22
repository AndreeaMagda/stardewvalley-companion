import type { SeasonalEvent } from '../types'

export const SEASONAL_EVENTS: SeasonalEvent[] = [
  // Spring
  { name: 'Egg Festival',      season: 'spring', day: 13, description: 'Egg hunt in Pelican Town plaza. Strawberry Seeds sold here.' },
  { name: 'Flower Dance',      season: 'spring', day: 24, description: 'Dancing festival in Cindersap Forest.' },

  // Summer
  { name: 'Luau',              season: 'summer', day: 11, description: 'Governor visits — add high-quality items to the communal soup.' },
  { name: 'Moonlight Jellies', season: 'summer', day: 28, description: 'Watch the glowing jellyfish float up the river at night.' },

  // Fall
  { name: 'Stardew Valley Fair', season: 'fall', day: 16, description: 'Grange display contest. Earn Star Tokens for prizes.' },
  { name: "Spirit's Eve",        season: 'fall', day: 27, description: 'Halloween-style maze. Collect candy and find the golden pumpkin.' },

  // Winter
  { name: 'Festival of Ice',     season: 'winter', day: 8,  description: 'Ice fishing contest on the lake.' },
  { name: 'Feast of the Winter Star', season: 'winter', day: 25, description: 'Secret gift exchange. Check your assigned villager.' },
]

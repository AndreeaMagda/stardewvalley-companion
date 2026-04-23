export type Season = 'spring' | 'summer' | 'fall' | 'winter'

export interface Crop {
  id: string
  name: string
  seasons: Season[]
  seedCost: number
  growDays: number
  regrowDays: number | null
  sellPrice: number
  /** wine (fruit) or juice (vegetable) value */
  kegValue: number | null
  /** jam (fruit) or pickles (vegetable) value */
  jarValue: number | null
  type: 'vegetable' | 'fruit' | 'flower' | 'grain'
  notes?: string
}

export interface VillagerBirthday {
  name: string
  season: Season
  day: number
  lovedGifts: string[]
}

export interface SeasonalEvent {
  name: string
  season: Season
  day: number
  description: string
}

// --- Database row types ---

export interface GardenEntry {
  id: string
  user_id: string
  crop_id: string
  planted_date: string
  planted_year: number
  season: Season
  day: number
  notes: string | null
  harvested: boolean
  created_at: string
  updated_at: string
}

export interface Resource {
  id: string
  user_id: string
  type: string
  quantity: number
  updated_at: string
}

export interface GiftedBirthday {
  id: string
  user_id: string
  villager_name: string
  year: number
  gifted: boolean
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  current_day: number
  current_season: Season
  current_year: number
  created_at: string
  updated_at: string
}

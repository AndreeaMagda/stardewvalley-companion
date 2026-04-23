import type { Season } from '../types'

export interface Fish {
  id: string
  name: string
  seasons: Season[]   // all 4 = year-round
  weather: 'any' | 'sun' | 'rain'
  time: string
  location: string
  difficulty: number  // 1–110
  sellPrice: number
  legendary: boolean
}

export const FISH: Fish[] = [
  // ── Year-round ───────────────────────────────────────────────────────────
  { id: 'carp',           name: 'Carp',           seasons: ['spring','summer','fall','winter'], weather: 'any',  time: '6am–8pm',            location: 'Mountain Lake · River · Forest Pond', difficulty: 15,  sellPrice: 30,   legendary: false },
  { id: 'largemouth',     name: 'Largemouth Bass', seasons: ['spring','summer','fall','winter'], weather: 'any',  time: '6am–8pm',            location: 'Mountain Lake',                       difficulty: 50,  sellPrice: 100,  legendary: false },
  { id: 'bullhead',       name: 'Bullhead',        seasons: ['spring','summer','fall','winter'], weather: 'any',  time: '6am–8pm',            location: 'Mountain Lake',                       difficulty: 46,  sellPrice: 75,   legendary: false },
  { id: 'woodskip',       name: 'Woodskip',        seasons: ['spring','summer','fall','winter'], weather: 'any',  time: '6am–8pm',            location: 'Secret Woods',                        difficulty: 67,  sellPrice: 75,   legendary: false },
  { id: 'ghostfish',      name: 'Ghostfish',       seasons: ['spring','summer','fall','winter'], weather: 'any',  time: 'Any time',           location: 'Mines (Floors 20 & 60)',              difficulty: 80,  sellPrice: 45,   legendary: false },
  { id: 'stonefish',      name: 'Stonefish',       seasons: ['spring','summer','fall','winter'], weather: 'any',  time: 'Any time',           location: 'Mines (Floor 20)',                    difficulty: 80,  sellPrice: 300,  legendary: false },
  { id: 'ice_pip',        name: 'Ice Pip',         seasons: ['spring','summer','fall','winter'], weather: 'any',  time: 'Any time',           location: 'Mines (Floor 60)',                    difficulty: 85,  sellPrice: 500,  legendary: false },
  { id: 'lava_eel',       name: 'Lava Eel',        seasons: ['spring','summer','fall','winter'], weather: 'any',  time: 'Any time',           location: 'Mines (Floor 100)',                   difficulty: 80,  sellPrice: 700,  legendary: false },
  { id: 'void_salmon',    name: 'Void Salmon',     seasons: ['spring','summer','fall','winter'], weather: 'any',  time: 'Any time',           location: "Witch's Swamp",                       difficulty: 80,  sellPrice: 150,  legendary: false },
  { id: 'slimejack',      name: 'Slimejack',       seasons: ['spring','summer','fall','winter'], weather: 'any',  time: 'Any time',           location: "Witch's Swamp cave",                  difficulty: 55,  sellPrice: 100,  legendary: false },
  { id: 'mutant_carp',    name: 'Mutant Carp',     seasons: ['spring','summer','fall','winter'], weather: 'any',  time: 'Any time',           location: 'Sewers',                              difficulty: 80,  sellPrice: 1000, legendary: true  },

  // ── Spring ───────────────────────────────────────────────────────────────
  { id: 'sardine',        name: 'Sardine',         seasons: ['spring','fall','winter'],          weather: 'any',  time: '6am–7pm',            location: 'Ocean',                               difficulty: 30,  sellPrice: 40,   legendary: false },
  { id: 'smallmouth',     name: 'Smallmouth Bass', seasons: ['spring','fall'],                   weather: 'any',  time: '6am–8pm',            location: 'River',                               difficulty: 28,  sellPrice: 50,   legendary: false },
  { id: 'catfish',        name: 'Catfish',         seasons: ['spring','fall'],                   weather: 'rain', time: '6am–12pm, 6pm–2am',  location: 'River · Secret Woods',                difficulty: 75,  sellPrice: 200,  legendary: false },
  { id: 'eel',            name: 'Eel',             seasons: ['spring','fall'],                   weather: 'rain', time: '4pm–2am',            location: 'Ocean',                               difficulty: 70,  sellPrice: 85,   legendary: false },
  { id: 'shad',           name: 'Shad',            seasons: ['spring','summer','fall'],          weather: 'rain', time: '9am–7pm',            location: 'River',                               difficulty: 45,  sellPrice: 60,   legendary: false },
  { id: 'legend',         name: 'Legend',          seasons: ['spring'],                          weather: 'rain', time: '6am–8pm',            location: 'Mountain Lake (west)',                difficulty: 110, sellPrice: 5000, legendary: true  },

  // ── Summer ───────────────────────────────────────────────────────────────
  { id: 'pufferfish',     name: 'Pufferfish',      seasons: ['summer'],                          weather: 'sun',  time: '12pm–4pm',           location: 'Ocean',                               difficulty: 80,  sellPrice: 200,  legendary: false },
  { id: 'tuna',           name: 'Tuna',            seasons: ['summer','winter'],                 weather: 'any',  time: '6am–7pm',            location: 'Ocean',                               difficulty: 70,  sellPrice: 100,  legendary: false },
  { id: 'red_snapper',    name: 'Red Snapper',     seasons: ['summer','fall'],                   weather: 'rain', time: '6am–7pm',            location: 'Ocean',                               difficulty: 40,  sellPrice: 150,  legendary: false },
  { id: 'tilapia',        name: 'Tilapia',         seasons: ['summer','fall'],                   weather: 'any',  time: '6am–2pm',            location: 'Ocean',                               difficulty: 50,  sellPrice: 75,   legendary: false },
  { id: 'pike',           name: 'Pike',            seasons: ['summer','winter'],                 weather: 'any',  time: '6am–8pm',            location: 'River · Mountain Lake',               difficulty: 60,  sellPrice: 100,  legendary: false },
  { id: 'octopus',        name: 'Octopus',         seasons: ['summer'],                          weather: 'any',  time: '6am–1pm',            location: 'Ocean',                               difficulty: 85,  sellPrice: 150,  legendary: false },
  { id: 'super_cucumber', name: 'Super Cucumber',  seasons: ['summer','fall'],                   weather: 'any',  time: '6pm–2am',            location: 'Ocean',                               difficulty: 80,  sellPrice: 250,  legendary: false },
  { id: 'crimsonfish',    name: 'Crimsonfish',     seasons: ['summer'],                          weather: 'any',  time: '6am–8pm',            location: 'Ocean (east pier)',                   difficulty: 95,  sellPrice: 1500, legendary: true  },

  // ── Fall ─────────────────────────────────────────────────────────────────
  { id: 'salmon',         name: 'Salmon',          seasons: ['fall'],                            weather: 'any',  time: '6am–7pm',            location: 'River',                               difficulty: 50,  sellPrice: 75,   legendary: false },
  { id: 'walleye',        name: 'Walleye',         seasons: ['fall'],                            weather: 'rain', time: '12pm–2am',           location: 'River · Mountain Lake · Forest Pond', difficulty: 45,  sellPrice: 105,  legendary: false },
  { id: 'tiger_trout',    name: 'Tiger Trout',     seasons: ['fall','winter'],                   weather: 'any',  time: '6am–7pm',            location: 'River',                               difficulty: 85,  sellPrice: 150,  legendary: false },
  { id: 'albacore',       name: 'Albacore',        seasons: ['fall','winter'],                   weather: 'any',  time: '6am–11am, 6pm–2am',  location: 'Ocean',                               difficulty: 60,  sellPrice: 75,   legendary: false },
  { id: 'midnight_carp',  name: 'Midnight Carp',   seasons: ['fall','winter'],                   weather: 'any',  time: '12pm–2am',           location: 'Mountain Lake · River · Forest Pond', difficulty: 55,  sellPrice: 150,  legendary: false },
  { id: 'angler',         name: 'Angler',          seasons: ['fall'],                            weather: 'any',  time: '6am–8pm',            location: 'River (north of JojaMart bridge)',    difficulty: 85,  sellPrice: 900,  legendary: true  },

  // ── Winter ───────────────────────────────────────────────────────────────
  { id: 'squid',          name: 'Squid',           seasons: ['winter'],                          weather: 'any',  time: '6pm–2am',            location: 'Ocean',                               difficulty: 75,  sellPrice: 80,   legendary: false },
  { id: 'lingcod',        name: 'Lingcod',         seasons: ['winter'],                          weather: 'any',  time: '6am–7pm',            location: 'River',                               difficulty: 85,  sellPrice: 120,  legendary: false },
  { id: 'spook_fish',     name: 'Spook Fish',      seasons: ['winter'],                          weather: 'any',  time: '5pm–2am',            location: 'Night Market (submarine)',            difficulty: 60,  sellPrice: 120,  legendary: false },
  { id: 'blobfish',       name: 'Blobfish',        seasons: ['winter'],                          weather: 'any',  time: '5pm–2am',            location: 'Night Market (submarine)',            difficulty: 67,  sellPrice: 500,  legendary: false },
  { id: 'midnight_squid', name: 'Midnight Squid',  seasons: ['winter'],                          weather: 'any',  time: '5pm–2am',            location: 'Night Market (submarine)',            difficulty: 80,  sellPrice: 100,  legendary: false },
  { id: 'glacierfish',    name: 'Glacierfish',     seasons: ['winter'],                          weather: 'any',  time: '6am–8pm',            location: 'River (south Arrowhead Island)',      difficulty: 80,  sellPrice: 1000, legendary: true  },
]

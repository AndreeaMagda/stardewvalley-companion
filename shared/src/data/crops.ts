import type { Crop } from '../types'

// keg: fruit → wine = base × 3 | vegetable → juice = floor(base × 2.25)
// jar: fruit → jam = base × 2 + 50 | vegetable → pickles = base × 2 + 50

export const CROPS: Crop[] = [
  // ── SPRING ──────────────────────────────────────────────────
  {
    id: 'parsnip', name: 'Parsnip', seasons: ['spring'],
    seedCost: 20, growDays: 4, regrowDays: null,
    sellPrice: 35, kegValue: 78, jarValue: 120,
    type: 'vegetable',
  },
  {
    id: 'potato', name: 'Potato', seasons: ['spring'],
    seedCost: 35, growDays: 6, regrowDays: null,
    sellPrice: 80, kegValue: 180, jarValue: 210,
    type: 'vegetable',
  },
  {
    id: 'cauliflower', name: 'Cauliflower', seasons: ['spring'],
    seedCost: 80, growDays: 12, regrowDays: null,
    sellPrice: 175, kegValue: 393, jarValue: 400,
    type: 'vegetable',
  },
  {
    id: 'green-bean', name: 'Green Bean', seasons: ['spring'],
    seedCost: 60, growDays: 10, regrowDays: 3,
    sellPrice: 40, kegValue: 90, jarValue: 130,
    type: 'vegetable',
  },
  {
    id: 'kale', name: 'Kale', seasons: ['spring'],
    seedCost: 70, growDays: 6, regrowDays: null,
    sellPrice: 110, kegValue: 247, jarValue: 270,
    type: 'vegetable',
  },
  {
    id: 'garlic', name: 'Garlic', seasons: ['spring'],
    seedCost: 40, growDays: 4, regrowDays: null,
    sellPrice: 60, kegValue: 135, jarValue: 170,
    type: 'vegetable',
  },
  {
    id: 'strawberry', name: 'Strawberry', seasons: ['spring'],
    seedCost: 100, growDays: 8, regrowDays: 4,
    sellPrice: 120, kegValue: 360, jarValue: 290,
    type: 'fruit',
    notes: 'Seeds sold at Egg Festival only',
  },
  {
    id: 'coffee', name: 'Coffee Bean', seasons: ['spring', 'summer'],
    seedCost: 2500, growDays: 10, regrowDays: 2,
    sellPrice: 15, kegValue: null, jarValue: null,
    type: 'vegetable',
    notes: '5 beans → 1 cup of Coffee (150g). Traveling Merchant only.',
  },
  {
    id: 'tulip', name: 'Tulip', seasons: ['spring'],
    seedCost: 20, growDays: 6, regrowDays: null,
    sellPrice: 30, kegValue: null, jarValue: null,
    type: 'flower',
  },
  {
    id: 'blue-jazz', name: 'Blue Jazz', seasons: ['spring'],
    seedCost: 30, growDays: 7, regrowDays: null,
    sellPrice: 50, kegValue: null, jarValue: null,
    type: 'flower',
  },

  // ── SUMMER ──────────────────────────────────────────────────
  {
    id: 'melon', name: 'Melon', seasons: ['summer'],
    seedCost: 80, growDays: 12, regrowDays: null,
    sellPrice: 250, kegValue: 750, jarValue: 550,
    type: 'fruit',
  },
  {
    id: 'tomato', name: 'Tomato', seasons: ['summer'],
    seedCost: 50, growDays: 11, regrowDays: 4,
    sellPrice: 60, kegValue: 180, jarValue: 170,
    type: 'fruit',
  },
  {
    id: 'blueberry', name: 'Blueberry', seasons: ['summer'],
    seedCost: 80, growDays: 13, regrowDays: 4,
    sellPrice: 50, kegValue: 150, jarValue: 150,
    type: 'fruit',
    notes: 'Yields 3 berries per harvest',
  },
  {
    id: 'hot-pepper', name: 'Hot Pepper', seasons: ['summer'],
    seedCost: 40, growDays: 5, regrowDays: 3,
    sellPrice: 40, kegValue: 120, jarValue: 130,
    type: 'fruit',
  },
  {
    id: 'radish', name: 'Radish', seasons: ['summer'],
    seedCost: 40, growDays: 6, regrowDays: null,
    sellPrice: 90, kegValue: 202, jarValue: 230,
    type: 'vegetable',
  },
  {
    id: 'red-cabbage', name: 'Red Cabbage', seasons: ['summer'],
    seedCost: 100, growDays: 9, regrowDays: null,
    sellPrice: 260, kegValue: 585, jarValue: 570,
    type: 'vegetable',
    notes: 'Seeds available Year 2+ from Pierre',
  },
  {
    id: 'starfruit', name: 'Starfruit', seasons: ['summer'],
    seedCost: 400, growDays: 13, regrowDays: null,
    sellPrice: 750, kegValue: 2250, jarValue: 1550,
    type: 'fruit',
    notes: 'Seeds from Oasis (Desert) only',
  },
  {
    id: 'corn', name: 'Corn', seasons: ['summer', 'fall'],
    seedCost: 150, growDays: 14, regrowDays: 4,
    sellPrice: 50, kegValue: 112, jarValue: 150,
    type: 'vegetable',
    notes: 'Grows in both Summer and Fall',
  },
  {
    id: 'hops', name: 'Hops', seasons: ['summer'],
    seedCost: 60, growDays: 11, regrowDays: 1,
    sellPrice: 25, kegValue: 300, jarValue: 100,
    type: 'vegetable',
    notes: 'Keg makes Pale Ale (300g) — very profitable',
  },
  {
    id: 'wheat', name: 'Wheat', seasons: ['summer', 'fall'],
    seedCost: 10, growDays: 4, regrowDays: null,
    sellPrice: 25, kegValue: 200, jarValue: null,
    type: 'grain',
    notes: 'Keg makes Beer (200g)',
  },
  {
    id: 'sunflower', name: 'Sunflower', seasons: ['summer', 'fall'],
    seedCost: 200, growDays: 8, regrowDays: null,
    sellPrice: 80, kegValue: null, jarValue: null,
    type: 'flower',
  },

  // ── FALL ────────────────────────────────────────────────────
  {
    id: 'pumpkin', name: 'Pumpkin', seasons: ['fall'],
    seedCost: 100, growDays: 13, regrowDays: null,
    sellPrice: 320, kegValue: 720, jarValue: 690,
    type: 'vegetable',
  },
  {
    id: 'yam', name: 'Yam', seasons: ['fall'],
    seedCost: 60, growDays: 10, regrowDays: null,
    sellPrice: 160, kegValue: 360, jarValue: 370,
    type: 'vegetable',
  },
  {
    id: 'bok-choy', name: 'Bok Choy', seasons: ['fall'],
    seedCost: 50, growDays: 4, regrowDays: null,
    sellPrice: 80, kegValue: 180, jarValue: 210,
    type: 'vegetable',
  },
  {
    id: 'amaranth', name: 'Amaranth', seasons: ['fall'],
    seedCost: 70, growDays: 7, regrowDays: null,
    sellPrice: 150, kegValue: 337, jarValue: 350,
    type: 'vegetable',
  },
  {
    id: 'grape', name: 'Grape', seasons: ['fall'],
    seedCost: 60, growDays: 10, regrowDays: 3,
    sellPrice: 80, kegValue: 240, jarValue: 210,
    type: 'fruit',
  },
  {
    id: 'cranberries', name: 'Cranberries', seasons: ['fall'],
    seedCost: 240, growDays: 7, regrowDays: 5,
    sellPrice: 75, kegValue: 225, jarValue: 200,
    type: 'fruit',
    notes: 'Yields 2 cranberries per harvest',
  },
  {
    id: 'artichoke', name: 'Artichoke', seasons: ['fall'],
    seedCost: 30, growDays: 8, regrowDays: null,
    sellPrice: 160, kegValue: 360, jarValue: 370,
    type: 'vegetable',
    notes: 'Seeds available Year 2+ from Pierre',
  },
  {
    id: 'sweet-gem-berry', name: 'Sweet Gem Berry', seasons: ['fall'],
    seedCost: 1000, growDays: 24, regrowDays: null,
    sellPrice: 3000, kegValue: null, jarValue: null,
    type: 'fruit',
    notes: 'Rare seed from Traveling Merchant. Best gifted to Old Master Cannoli.',
  },
  {
    id: 'fairy-rose', name: 'Fairy Rose', seasons: ['fall'],
    seedCost: 200, growDays: 12, regrowDays: null,
    sellPrice: 290, kegValue: null, jarValue: null,
    type: 'flower',
  },
  {
    id: 'eggplant', name: 'Eggplant', seasons: ['fall'],
    seedCost: 20, growDays: 5, regrowDays: 5,
    sellPrice: 60, kegValue: 135, jarValue: 170,
    type: 'vegetable',
  },
]

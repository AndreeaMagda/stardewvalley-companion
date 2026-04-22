import type { VillagerBirthday } from '../types'

// Verify dates at: https://stardewvalleywiki.com/Festivals
export const VILLAGER_BIRTHDAYS: VillagerBirthday[] = [
  // Spring
  { name: 'Kent',      season: 'spring', day: 4,  lovedGifts: ['Roasted Hazelnuts'] },
  { name: 'Lewis',     season: 'spring', day: 7,  lovedGifts: ['Hot Pepper', 'Autumn\'s Bounty'] },
  { name: 'Vincent',   season: 'spring', day: 10, lovedGifts: ['Grape', 'Snail', 'Pink Cake', 'Cranberry Candy'] },
  { name: 'Haley',     season: 'spring', day: 14, lovedGifts: ['Sunflower', 'Fruit Salad', 'Coconut', 'Pink Cake'] },
  { name: 'Jodi',      season: 'spring', day: 16, lovedGifts: ['Vegetable Medley', 'Chocolate Cake', 'Diamond', 'Crispy Bass'] },
  { name: 'Pam',       season: 'spring', day: 18, lovedGifts: ['Parsnip Soup', 'Miner\'s Treat', 'Pale Ale', 'Cactus Fruit'] },
  { name: 'Shane',     season: 'spring', day: 20, lovedGifts: ['Pizza', 'Pepper Poppers', 'Hot Pepper'] },
  { name: 'Pierre',    season: 'spring', day: 26, lovedGifts: ['Fried Calamari'] },
  { name: 'Emily',     season: 'spring', day: 27, lovedGifts: ['Cloth', 'Wool', 'Aquamarine', 'Amethyst', 'Ruby', 'Emerald', 'Topaz', 'Jade'] },

  // Summer
  { name: 'Penny',     season: 'summer', day: 2,  lovedGifts: ['Melon', 'Tom Kha Soup', 'Red Plate', 'Roots Platter', 'Diamond', 'Poppy'] },
  { name: 'Jas',       season: 'summer', day: 4,  lovedGifts: ['Fairy Rose', 'Plum Pudding', 'Pink Cake'] },
  { name: 'Gus',       season: 'summer', day: 8,  lovedGifts: ['Fish Taco', 'Orange', 'Escargot', 'Diamond'] },
  { name: 'Maru',      season: 'summer', day: 10, lovedGifts: ['Battery Pack', 'Cauliflower', 'Diamond', 'Gold Bar', 'Iridium Bar', 'Miner\'s Treat', 'Pepper Poppers', 'Radioactive Bar', 'Strawberry'] },
  { name: 'Alex',      season: 'summer', day: 13, lovedGifts: ['Complete Breakfast', 'Salmon Dinner'] },
  { name: 'Sam',       season: 'summer', day: 17, lovedGifts: ['Cactus Fruit', 'Maple Bar', 'Pizza', 'Tigerseye'] },
  { name: 'Sebastian', season: 'summer', day: 19, lovedGifts: ['Frozen Tear', 'Obsidian', 'Pumpkin Soup', 'Sashimi', 'Void Egg'] },
  { name: 'Dwarf',     season: 'summer', day: 22, lovedGifts: ['Amethyst', 'Aquamarine', 'Emerald', 'Ruby', 'Topaz'] },
  { name: 'Willy',     season: 'summer', day: 24, lovedGifts: ['Catfish', 'Diamond', 'Gold Bar', 'Iridium Bar', 'Mead', 'Octopus', 'Pumpkin', 'Sea Cucumber', 'Sturgeon'] },
  { name: 'Leo',       season: 'summer', day: 26, lovedGifts: ['Duck Feather', 'Mango', 'Ostrich Egg'] },

  // Fall
  { name: 'Elliott',   season: 'fall', day: 5,  lovedGifts: ['Crab Cakes', 'Duck Feather', 'Lobster', 'Pomegranate', 'Tom Kha Soup'] },
  { name: 'Clint',     season: 'fall', day: 26, lovedGifts: ['Amethyst', 'Aquamarine', 'Artichoke Dip', 'Fiddlehead Risotto', 'Gold Bar', 'Iridium Bar', 'Omni Geode'] },
  { name: 'Sandy',     season: 'fall', day: 15, lovedGifts: ['Crocus', 'Daffodil', 'Maki Roll', 'Sweet Pea'] },
  { name: 'Abigail',   season: 'fall', day: 13, lovedGifts: ['Amethyst', 'Blackberry Cobbler', 'Chocolate Cake', 'Pufferfish', 'Pumpkin', 'Spicy Eel'] },
  { name: 'Wizard',    season: 'fall', day: 17, lovedGifts: ['Purple Mushroom', 'Solar Essence', 'Super Cucumber', 'Void Essence'] },
  { name: 'Evelyn',    season: 'fall', day: 20, lovedGifts: ['Beet', 'Chocolate Cake', 'Diamond', 'Fairy Rose', 'Stuffing', 'Tulip'] },
  { name: 'Marnie',    season: 'fall', day: 18, lovedGifts: ['Diamond', 'Farmer\'s Lunch', 'Pink Cake', 'Pumpkin Pie'] },
  { name: 'Robin',     season: 'fall', day: 21, lovedGifts: ['Goat Cheese', 'Peach', 'Spaghetti'] },
  { name: 'Linus',     season: 'fall', day: 3,  lovedGifts: ['Blueberry Tart', 'Cactus Fruit', 'Coconut', 'Dish O\' The Sea', 'Yam'] },

  // Winter
  { name: 'Krobus',    season: 'winter', day: 1,  lovedGifts: ['Diamond', 'Iridium Bar', 'Pumpkin', 'Void Egg', 'Void Mayonnaise', 'Wild Horseradish'] },
  { name: 'Demetrius', season: 'winter', day: 19, lovedGifts: ['Bean Hotpot', 'Ice Cream', 'Rice Pudding', 'Strawberry'] },
  { name: 'Caroline',  season: 'winter', day: 7,  lovedGifts: ['Fish Taco', 'Green Tea', 'Summer Spangle', 'Tropical Curry'] },
  { name: 'Harvey',    season: 'winter', day: 14, lovedGifts: ['Coffee', 'Pickles', 'Super Meal', 'Truffle Oil', 'Wine'] },
  { name: 'Leah',      season: 'winter', day: 23, lovedGifts: ['Goat Cheese', 'Poppyseed Muffin', 'Salad', 'Stir Fry', 'Truffle', 'Vegetable Medley', 'Wine'] },
  { name: 'George',    season: 'winter', day: 24, lovedGifts: ['Fried Mushroom', 'Leek'] },
]

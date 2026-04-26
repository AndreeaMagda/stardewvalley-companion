const W = 'https://stardewvalleywiki.com/mediawiki/images/thumb'

export const CROP_SPRITES: Record<string, string> = {
  'parsnip':        `${W}/d/db/Parsnip.png/24px-Parsnip.png`,
  'potato':         `${W}/c/c2/Potato.png/24px-Potato.png`,
  'cauliflower':    `${W}/a/aa/Cauliflower.png/24px-Cauliflower.png`,
  'green-bean':     `${W}/5/5c/Green_Bean.png/24px-Green_Bean.png`,
  'kale':           `${W}/d/d1/Kale.png/24px-Kale.png`,
  'garlic':         `${W}/c/cc/Garlic.png/24px-Garlic.png`,
  'strawberry':     `${W}/6/6d/Strawberry.png/24px-Strawberry.png`,
  'coffee':         `${W}/3/33/Coffee_Bean.png/24px-Coffee_Bean.png`,
  'tulip':          `${W}/c/cf/Tulip.png/24px-Tulip.png`,
  'blue-jazz':      `${W}/2/2f/Blue_Jazz.png/24px-Blue_Jazz.png`,
  'melon':          `${W}/1/19/Melon.png/24px-Melon.png`,
  'tomato':         `${W}/9/9d/Tomato.png/24px-Tomato.png`,
  'blueberry':      `${W}/9/9e/Blueberry.png/24px-Blueberry.png`,
  'hot-pepper':     `${W}/f/f1/Hot_Pepper.png/24px-Hot_Pepper.png`,
  'radish':         `${W}/d/d5/Radish.png/24px-Radish.png`,
  'red-cabbage':    `${W}/2/2d/Red_Cabbage.png/24px-Red_Cabbage.png`,
  'starfruit':      `${W}/d/db/Starfruit.png/24px-Starfruit.png`,
  'corn':           `${W}/f/f8/Corn.png/24px-Corn.png`,
  'hops':           `${W}/5/59/Hops.png/24px-Hops.png`,
  'wheat':          `${W}/e/e2/Wheat.png/24px-Wheat.png`,
  'sunflower':      `${W}/8/81/Sunflower.png/24px-Sunflower.png`,
  'pumpkin':        `${W}/6/64/Pumpkin.png/24px-Pumpkin.png`,
  'yam':            `${W}/5/52/Yam.png/24px-Yam.png`,
  'bok-choy':       `${W}/4/40/Bok_Choy.png/24px-Bok_Choy.png`,
  'amaranth':       `${W}/f/f6/Amaranth.png/24px-Amaranth.png`,
  'grape':          `${W}/c/c2/Grape.png/24px-Grape.png`,
  'cranberries':    `${W}/6/6e/Cranberries.png/24px-Cranberries.png`,
  'artichoke':      `${W}/d/dd/Artichoke.png/24px-Artichoke.png`,
  'sweet-gem-berry':`${W}/8/88/Sweet_Gem_Berry.png/24px-Sweet_Gem_Berry.png`,
  'fairy-rose':     `${W}/5/5c/Fairy_Rose.png/24px-Fairy_Rose.png`,
  'eggplant':       `${W}/8/8f/Eggplant.png/24px-Eggplant.png`,
}

export function cropSprite(id: string): string | undefined {
  return CROP_SPRITES[id]
}

const B = 'https://stardewvalleywiki.com/mediawiki/images'

// Full-size sprites (no thumbnail path) — more reliable for hotlink
export const MINE_SPRITES: Record<string, string> = {
  // Gems
  'Amethyst':       `${B}/2/2e/Amethyst.png`,
  'Topaz':          `${B}/a/a5/Topaz.png`,
  'Jade':           `${B}/7/7e/Jade.png`,
  'Aquamarine':     `${B}/a/a2/Aquamarine.png`,
  'Ruby':           `${B}/a/a9/Ruby.png`,
  'Emerald':        `${B}/6/6a/Emerald.png`,
  'Diamond':        `${B}/e/ea/Diamond.png`,
  'Prismatic Shard':`${B}/5/56/Prismatic_Shard.png`,
  // Minerals
  'Quartz':         `${B}/c/cf/Quartz.png`,
  'Earth Crystal':  `${B}/7/74/Earth_Crystal.png`,
  'Frozen Tear':    `${B}/e/ec/Frozen_Tear.png`,
  'Fire Quartz':    `${B}/5/5b/Fire_Quartz.png`,
  // Geodes
  'Geode':             `${B}/4/43/Geode.png`,
  'Frozen Geode':      `${B}/b/bf/Frozen_Geode.png`,
  'Magma Geode':       `${B}/8/89/Magma_Geode.png`,
  'Omni Geode':        `${B}/0/09/Omni_Geode.png`,
  // Ores (node/rock sprites — best available)
  'Copper Ore':        `${B}/c/c8/Copper_Node.png`,
  'Iron Ore':          `${B}/e/ea/Iron_Node.png`,
  'Gold Ore':          `${B}/8/88/Gold_Node.png`,
  'Iridium Ore':       `${B}/4/4d/Iridium_Node.png`,
  'Radioactive Ore':   `${B}/4/48/Radioactive_Node.png`,
  'Coal':              `${B}/3/3b/Coal_Node_Quarry_01.png`,
  'Stone':             `${B}/4/45/Stone_Index668.png`,
}

export function mineSprite(name: string): string | undefined {
  return MINE_SPRITES[name]
}

const V = 'https://stardewvalleywiki.com/mediawiki/images'

export const VILLAGER_SPRITES: Record<string, string> = {
  'Alex':       `${V}/0/04/Alex.png`,
  'Elliott':    `${V}/b/bd/Elliott.png`,
  'Harvey':     `${V}/9/95/Harvey.png`,
  'Sam':        `${V}/9/94/Sam.png`,
  'Sebastian':  `${V}/a/a8/Sebastian.png`,
  'Shane':      `${V}/8/8b/Shane.png`,
  'Abigail':    `${V}/8/88/Abigail.png`,
  'Emily':      `${V}/2/28/Emily.png`,
  'Haley':      `${V}/1/1b/Haley.png`,
  'Leah':       `${V}/e/e6/Leah.png`,
  'Maru':       `${V}/f/f8/Maru.png`,
  'Penny':      `${V}/a/ab/Penny.png`,
  'Caroline':   `${V}/8/87/Caroline.png`,
  'Clint':      `${V}/3/31/Clint.png`,
  'Demetrius':  `${V}/f/f9/Demetrius.png`,
  'Dwarf':      `${V}/e/ed/Dwarf.png`,
  'Evelyn':     `${V}/8/8e/Evelyn.png`,
  'George':     `${V}/7/78/George.png`,
  'Gus':        `${V}/5/52/Gus.png`,
  'Jas':        `${V}/5/55/Jas.png`,
  'Jodi':       `${V}/4/41/Jodi.png`,
  'Kent':       `${V}/9/99/Kent.png`,
  'Krobus':     `${V}/7/71/Krobus.png`,
  'Leo':        `${V}/1/1d/Leo.png`,
  'Lewis':      `${V}/2/2b/Lewis.png`,
  'Linus':      `${V}/3/31/Linus.png`,
  'Marnie':     `${V}/5/52/Marnie.png`,
  'Pam':        `${V}/d/da/Pam.png`,
  'Pierre':     `${V}/7/7e/Pierre.png`,
  'Robin':      `${V}/1/1b/Robin.png`,
  'Sandy':      `${V}/4/4e/Sandy.png`,
  'Vincent':    `${V}/f/f1/Vincent.png`,
  'Willy':      `${V}/8/82/Willy.png`,
  'Wizard':     `${V}/c/c7/Wizard.png`,
}

export function villagerSprite(name: string): string | undefined {
  return VILLAGER_SPRITES[name]
}

const T = 'https://stardewvalleywiki.com/mediawiki/images/thumb'

export const RESOURCE_SPRITES: Record<string, string> = {
  // Basic Materials
  'Wood':               `${T}/d/df/Wood.png/24px-Wood.png`,
  'Stone':              `${T}/d/d4/Stone.png/24px-Stone.png`,
  'Fiber':              `${T}/4/45/Fiber.png/24px-Fiber.png`,
  'Sap':                `${T}/7/73/Sap.png/24px-Sap.png`,
  'Hardwood':           `${T}/e/ed/Hardwood.png/24px-Hardwood.png`,
  // Ores
  'Coal':               `${T}/a/a7/Coal.png/24px-Coal.png`,
  'Copper Ore':         `${T}/7/78/Copper_Ore.png/24px-Copper_Ore.png`,
  'Iron Ore':           `${T}/8/87/Iron_Ore.png/24px-Iron_Ore.png`,
  'Gold Ore':           `${T}/f/f7/Gold_Ore.png/24px-Gold_Ore.png`,
  'Iridium Ore':        `${T}/e/e9/Iridium_Ore.png/24px-Iridium_Ore.png`,
  // Farming Supplies
  'Mixed Seeds':        `${T}/2/2e/Mixed_Seeds.png/24px-Mixed_Seeds.png`,
  'Basic Fertilizer':   `${B}/9/9b/Basic_Fertilizer.png`,
  'Quality Fertilizer': `${B}/a/a0/Quality_Fertilizer.png`,
  'Speed-Gro':          `${B}/9/94/Speed-Gro.png`,
  // Combat & Fishing
  'Bait':               `${B}/f/ff/Bait.png`,
  'Bomb':               `${B}/3/3b/Bomb.png`,
  'Cherry Bomb':        `${B}/1/1b/Cherry_Bomb.png`,
  'Mega Bomb':          `${B}/4/4f/Mega_Bomb.png`,
}

export function resourceSprite(name: string): string | undefined {
  return RESOURCE_SPRITES[name]
}

export const FORAGE_SPRITES: Record<string, string> = {
  // Spring
  'Wild Horseradish': `${W}/9/90/Wild_Horseradish.png/24px-Wild_Horseradish.png`,
  'Daffodil':         `${W}/4/4b/Daffodil.png/24px-Daffodil.png`,
  'Leek':             `${W}/5/57/Leek.png/24px-Leek.png`,
  'Dandelion':        `${W}/b/b1/Dandelion.png/24px-Dandelion.png`,
  'Spring Onion':     `${W}/0/0c/Spring_Onion.png/24px-Spring_Onion.png`,
  'Salmonberry':      `${W}/5/59/Salmonberry.png/24px-Salmonberry.png`,
  // Summer
  'Grape':            `${W}/c/c2/Grape.png/24px-Grape.png`,
  'Spice Berry':      `${W}/c/c6/Spice_Berry.png/24px-Spice_Berry.png`,
  'Sweet Pea':        `${W}/d/d9/Sweet_Pea.png/24px-Sweet_Pea.png`,
  'Fiddlehead Fern':  `${W}/4/48/Fiddlehead_Fern.png/24px-Fiddlehead_Fern.png`,
  'Red Mushroom':     `${W}/e/e1/Red_Mushroom.png/24px-Red_Mushroom.png`,
  // Fall
  'Common Mushroom':  `${W}/2/2e/Common_Mushroom.png/24px-Common_Mushroom.png`,
  'Wild Plum':        `${W}/3/3b/Wild_Plum.png/24px-Wild_Plum.png`,
  'Hazelnut':         `${W}/3/31/Hazelnut.png/24px-Hazelnut.png`,
  'Blackberry':       `${W}/2/25/Blackberry.png/24px-Blackberry.png`,
  'Chanterelle':      `${W}/1/1d/Chanterelle.png/24px-Chanterelle.png`,
  'Holly':            `${W}/b/b8/Holly.png/24px-Holly.png`,
  // Winter
  'Winter Root':      `${W}/1/11/Winter_Root.png/24px-Winter_Root.png`,
  'Crystal Fruit':    `${W}/1/16/Crystal_Fruit.png/24px-Crystal_Fruit.png`,
  'Snow Yam':         `${W}/3/3f/Snow_Yam.png/24px-Snow_Yam.png`,
  'Crocus':           `${W}/2/2f/Crocus.png/24px-Crocus.png`,
  'Nautilus Shell':   `${W}/a/a4/Nautilus_Shell.png/24px-Nautilus_Shell.png`,
}

export function foragingSprite(name: string): string | undefined {
  return FORAGE_SPRITES[name]
}

export const ARTISAN_SPRITES: Record<string, string> = {
  'Wine':     `${W}/6/69/Wine.png/24px-Wine.png`,
  'Juice':    `${W}/f/f1/Juice.png/24px-Juice.png`,
  'Jelly':    `${W}/0/05/Jelly.png/24px-Jelly.png`,
  'Pickles':  `${W}/c/c7/Pickles.png/24px-Pickles.png`,
  'Pale Ale': `${W}/7/78/Pale_Ale.png/24px-Pale_Ale.png`,
  'Beer':     `${W}/b/b3/Beer.png/24px-Beer.png`,
}

export function artisanSprite(name: string): string | undefined {
  return ARTISAN_SPRITES[name]
}

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

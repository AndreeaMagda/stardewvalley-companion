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

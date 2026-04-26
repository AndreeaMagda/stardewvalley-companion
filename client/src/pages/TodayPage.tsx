import { useEffect, useState } from 'react'
import { VILLAGER_BIRTHDAYS, SEASONAL_EVENTS, FISH, CROPS } from '@shared'
import type { GardenEntry, CaughtFish, Resource, Season, Crop } from '@shared'
import { supabase } from '../api/supabase'
import { useAppStore } from '../store/useAppStore'
import { useUserId } from '../hooks/useUserId'
import { villagerSprite, cropSprite, artisanSprite } from '../data/sprites'
import {
  Gift, Star, Wheat, Fish as FishIcon, Check,
  Clock, FlaskConical, Hammer, type LucideIcon,
} from 'lucide-react'

// ── helpers ────────────────────────────────────────────────────────────────────

const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_STYLE: Record<Season, { text: string; soft: string; border: string }> = {
  spring: { text: 'text-spring', soft: 'bg-spring/10', border: 'border-spring/20' },
  summer: { text: 'text-summer', soft: 'bg-summer/10', border: 'border-summer/20' },
  fall:   { text: 'text-fall',   soft: 'bg-fall/10',   border: 'border-fall/20'   },
  winter: { text: 'text-winter', soft: 'bg-winter/10', border: 'border-winter/20' },
}

function yearAbs(season: Season, day: number) {
  return SEASONS.indexOf(season) * 28 + (day - 1)
}

function daysUntil(tSeason: Season, tDay: number, cSeason: Season, cDay: number) {
  const diff = yearAbs(tSeason, tDay) - yearAbs(cSeason, cDay)
  return diff > 0 ? diff : 112 + diff
}

function getCropInfo(entry: GardenEntry, year: number, season: Season, day: number) {
  const crop = CROPS.find((c) => c.id === entry.crop_id)
  if (!crop) return null
  const curAbs   = (year - 1) * 112 + yearAbs(season, day)
  const plantAbs = (entry.planted_year - 1) * 112 + yearAbs(entry.season, entry.day)
  const elapsed  = curAbs - plantAbs
  if (elapsed >= crop.growDays) return { crop, ready: true, daysLeft: 0 }
  return { crop, ready: false, daysLeft: crop.growDays - elapsed }
}

function kegLabel(crop: Crop) {
  if (crop.id === 'hops')  return 'Pale Ale'
  if (crop.id === 'wheat') return 'Beer'
  return crop.type === 'fruit' ? 'Wine' : 'Juice'
}

function jarLabel(crop: Crop) {
  return crop.type === 'fruit' ? 'Jelly' : 'Pickles'
}

// ── crafting recipes using tracked resources ────────────────────────────────────

const CRAFTABLE = [
  { name: 'Furnace',           req: { 'Stone': 25, 'Copper Ore': 20 },      desc: 'Smelt ores into bars' },
  { name: 'Chest',             req: { 'Wood': 50 },                          desc: 'Extra storage on farm' },
  { name: 'Scarecrow',         req: { 'Wood': 50, 'Fiber': 20, 'Coal': 1 }, desc: 'Protects a 17×17 area' },
  { name: 'Basic Fertilizer',  req: { 'Sap': 2 },                            desc: 'Boosts crop quality (×2 Sap → 1)' },
  { name: 'Cherry Bomb',       req: { 'Copper Ore': 4, 'Coal': 1 },          desc: '2-tile radius explosion' },
  { name: 'Bomb',              req: { 'Iron Ore': 4, 'Coal': 1 },            desc: '3-tile radius explosion' },
  { name: 'Bait',              req: { 'Bug Meat': 1 },                       desc: '5 Bait — halves bite time' },
]

// ── sub-components ─────────────────────────────────────────────────────────────

function SectionHeader({ title, Icon }: { title: string; Icon: LucideIcon }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={12} className="text-muted" strokeWidth={1.75} />
      <p className="text-[11px] uppercase tracking-widest text-muted font-medium">{title}</p>
    </div>
  )
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="bg-cream-dark rounded-2xl px-4 py-3 text-center">
      <p className="text-sm text-muted">{text}</p>
    </div>
  )
}

// ── main page ──────────────────────────────────────────────────────────────────

export default function TodayPage() {
  const userId = useUserId()
  const { currentDay, currentSeason, currentYear } = useAppStore()

  const [entries,   setEntries]   = useState<GardenEntry[]>([])
  const [caught,    setCaught]    = useState<CaughtFish[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loading,   setLoading]   = useState(false)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    Promise.all([
      supabase.from('garden_entries').select('*').eq('user_id', userId).eq('harvested', false),
      supabase.from('caught_fish').select('*').eq('user_id', userId),
      supabase.from('resources').select('*').eq('user_id', userId),
    ]).then(([gardenRes, fishRes, resRes]) => {
      setEntries((gardenRes.data as GardenEntry[]) ?? [])
      setCaught((fishRes.data as CaughtFish[]) ?? [])
      setResources((resRes.data as Resource[]) ?? [])
      setLoading(false)
    })
  }, [userId])

  const markHarvested = async (entry: GardenEntry) => {
    if (!userId) return
    await supabase.from('garden_entries')
      .update({ harvested: true, updated_at: new Date().toISOString() })
      .eq('id', entry.id)
    setEntries((prev) => prev.filter((e) => e.id !== entry.id))
  }

  const s = SEASON_STYLE[currentSeason]

  // ── birthdays ────────────────────────────────────────────────────────────────
  const todayBirthday = VILLAGER_BIRTHDAYS.find(
    (v) => v.season === currentSeason && v.day === currentDay,
  )
  const upcomingBirthdays = VILLAGER_BIRTHDAYS
    .map((v) => ({ ...v, in: daysUntil(v.season, v.day, currentSeason, currentDay) }))
    .filter((v) => v.in > 0 && v.in <= 7)
    .sort((a, b) => a.in - b.in)

  // ── festivals ────────────────────────────────────────────────────────────────
  const todayFestival = SEASONAL_EVENTS.find(
    (e) => e.season === currentSeason && e.day === currentDay,
  )
  const upcomingFestivals = SEASONAL_EVENTS
    .map((e) => ({ ...e, in: daysUntil(e.season, e.day, currentSeason, currentDay) }))
    .filter((e) => e.in > 0 && e.in <= 14)
    .sort((a, b) => a.in - b.in)

  // ── crops ────────────────────────────────────────────────────────────────────
  const cropInfos = entries
    .map((e) => ({ entry: e, info: getCropInfo(e, currentYear, currentSeason, currentDay) }))
    .filter((x) => x.info !== null) as { entry: GardenEntry; info: NonNullable<ReturnType<typeof getCropInfo>> }[]

  const readyCrops = cropInfos.filter((x) => x.info.ready)
  const soonCrops  = cropInfos
    .filter((x) => !x.info.ready && x.info.daysLeft <= 3)
    .sort((a, b) => a.info.daysLeft - b.info.daysLeft)

  // ── fish ─────────────────────────────────────────────────────────────────────
  const seasonFish   = FISH.filter((f) => f.seasons.includes(currentSeason))
  const caughtIds    = new Set(caught.filter((c) => c.caught).map((c) => c.fish_id))
  const uncaughtFish = seasonFish.filter((f) => !caughtIds.has(f.id))

  // ── artisan possibilities ─────────────────────────────────────────────────────
  const artisanOpts = cropInfos
    .filter((x) => x.info.crop.kegValue || x.info.crop.jarValue)
    .flatMap(({ info }) => {
      const opts = []
      if (info.crop.kegValue) opts.push({ crop: info.crop, product: kegLabel(info.crop), value: info.crop.kegValue, daysLeft: info.daysLeft, ready: info.ready })
      if (info.crop.jarValue) opts.push({ crop: info.crop, product: jarLabel(info.crop), value: info.crop.jarValue, daysLeft: info.daysLeft, ready: info.ready })
      return opts
    })
    .sort((a, b) => b.value - a.value)

  // ── crafting possibilities ─────────────────────────────────────────────────────
  const qtyMap: Record<string, number> = {}
  resources.forEach((r) => { qtyMap[r.type] = r.quantity })

  const craftable = CRAFTABLE
    .map((item) => {
      const canMake = Math.floor(
        Math.min(...Object.entries(item.req).map(([res, need]) => (qtyMap[res] ?? 0) / need))
      )
      return { ...item, canMake }
    })
    .filter((x) => x.canMake >= 1)

  // ── today is clear? ───────────────────────────────────────────────────────────
  const todayClear = !todayBirthday && !todayFestival && readyCrops.length === 0

  return (
    <div className="p-4 md:p-8 max-w-2xl space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-ink">Today</h2>
        <p className={`text-sm mt-0.5 capitalize font-medium ${s.text}`}>
          {currentSeason} {currentDay}, Year {currentYear}
        </p>
      </div>

      {/* ═══════════════ TODAY ══════════════════════════════════════════ */}
      <section className="space-y-3">
        <SectionHeader title="Today" Icon={Check} />

        {todayClear && <EmptyCard text="Nothing urgent right now." />}

        {/* Birthday today */}
        {todayBirthday && (
          <div className="bg-brown-pale border border-brown/20 rounded-2xl p-5 flex items-start gap-4"
            style={{ boxShadow: 'var(--shadow-card)' }}>
            {villagerSprite(todayBirthday.name)
              ? <img src={villagerSprite(todayBirthday.name)!} alt={todayBirthday.name}
                  width={48} style={{ imageRendering: 'pixelated', flexShrink: 0 }} referrerPolicy="no-referrer" />
              : <div className="w-12 h-12 rounded-xl bg-brown/10 flex items-center justify-center flex-shrink-0">
                  <Gift size={22} className="text-brown" strokeWidth={1.5} />
                </div>
            }
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-semibold text-ink">{todayBirthday.name}'s Birthday</p>
                <span className="text-[11px] bg-brown text-cream px-2 py-0.5 rounded-full font-medium">Today!</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Loves: {todayBirthday.lovedGifts.slice(0, 5).join(', ')}{todayBirthday.lovedGifts.length > 5 ? '…' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Festival today */}
        {todayFestival && (
          <div className={`border rounded-2xl p-4 ${s.soft} ${s.border}`}
            style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Star size={14} className={s.text} strokeWidth={1.75} />
              <p className={`font-semibold text-ink`}>{todayFestival.name}</p>
              <span className={`text-[11px] font-semibold ${s.text}`}>Today!</span>
            </div>
            <p className="text-xs text-muted">{todayFestival.description}</p>
          </div>
        )}

        {/* Ready crops */}
        {userId && !loading && readyCrops.map(({ entry, info }) => (
          <div key={entry.id}
            className="bg-white border border-green/25 rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ boxShadow: 'var(--shadow-card)' }}>
            {cropSprite(entry.crop_id) && (
              <img src={cropSprite(entry.crop_id)!} alt={info.crop.name}
                width={28} style={{ imageRendering: 'pixelated', flexShrink: 0 }} referrerPolicy="no-referrer" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink text-sm">{info.crop.name}</p>
              <p className="text-[11px] text-green font-medium">Ready to harvest</p>
            </div>
            <button onClick={() => markHarvested(entry)}
              className="flex items-center gap-1.5 text-xs bg-green hover:bg-green-light text-cream px-3 py-1.5 rounded-lg font-medium transition-colors flex-shrink-0">
              <Check size={11} />Harvest
            </button>
          </div>
        ))}

        {loading && <p className="text-sm text-muted">Loading…</p>}
      </section>

      {/* ═══════════════ UPCOMING ══════════════════════════════════════════ */}
      <section className="space-y-3">
        <SectionHeader title="Upcoming" Icon={Clock} />

        {upcomingBirthdays.length === 0 && soonCrops.length === 0 && upcomingFestivals.length === 0 && (
          <EmptyCard text="Nothing coming up in the next few days." />
        )}

        {/* Upcoming birthdays */}
        {upcomingBirthdays.map((v) => (
          <div key={v.name}
            className="bg-white border border-parchment rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ boxShadow: 'var(--shadow-card)' }}>
            {villagerSprite(v.name)
              ? <img src={villagerSprite(v.name)!} alt={v.name}
                  width={28} style={{ imageRendering: 'pixelated', flexShrink: 0 }} referrerPolicy="no-referrer" />
              : <div className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center flex-shrink-0">
                  <Gift size={12} className="text-muted" />
                </div>
            }
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink text-sm">{v.name}</p>
              <p className="text-[10px] text-muted truncate">
                Loves: {v.lovedGifts.slice(0, 3).join(', ')}
              </p>
            </div>
            <span className={`text-xs font-semibold ${s.text} flex-shrink-0`}>
              {v.in === 1 ? 'Tomorrow' : `in ${v.in}d`}
            </span>
          </div>
        ))}

        {/* Crops coming soon */}
        {userId && soonCrops.map(({ entry, info }) => (
          <div key={entry.id}
            className="bg-white border border-parchment rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ boxShadow: 'var(--shadow-card)' }}>
            {cropSprite(entry.crop_id) && (
              <img src={cropSprite(entry.crop_id)!} alt={info.crop.name}
                width={28} style={{ imageRendering: 'pixelated', flexShrink: 0, opacity: 0.7 }} referrerPolicy="no-referrer" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink text-sm">{info.crop.name}</p>
              <p className="text-[11px] text-muted">
                {info.daysLeft === 1 ? 'Ready tomorrow' : `Ready in ${info.daysLeft} days`}
              </p>
            </div>
            <span className={`text-sm font-bold ${s.text} flex-shrink-0`}>{info.daysLeft}d</span>
          </div>
        ))}

        {/* Upcoming festivals */}
        {upcomingFestivals.map((e) => (
          <div key={e.name}
            className="bg-white border border-parchment rounded-2xl px-4 py-3"
            style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center justify-between gap-3 mb-1">
              <p className="font-semibold text-ink text-sm">{e.name}</p>
              <span className={`text-xs font-semibold ${s.text} flex-shrink-0`}>
                {e.in === 1 ? 'Tomorrow' : `in ${e.in}d`}
              </span>
            </div>
            <p className="text-xs text-muted">{e.description}</p>
          </div>
        ))}
      </section>

      {/* ═══════════════ POSSIBILITIES ══════════════════════════════════════════ */}
      {userId && (
        <section className="space-y-6">
          <SectionHeader title="With your stuff" Icon={Hammer} />

          {/* Artisan goods */}
          {artisanOpts.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted mb-2">
                <FlaskConical size={10} strokeWidth={1.75} />Artisan goods
              </p>
              <div className="space-y-2">
                {artisanOpts.map((opt, i) => {
                  const sprite = artisanSprite(opt.product)
                  return (
                    <div key={i}
                      className="bg-white border border-parchment rounded-2xl px-4 py-3 flex items-center gap-3"
                      style={{ boxShadow: 'var(--shadow-card)' }}>
                      {sprite && (
                        <img src={sprite} alt={opt.product} width={24} height={24}
                          style={{ imageRendering: 'pixelated', flexShrink: 0 }} referrerPolicy="no-referrer" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink">
                          {opt.crop.name} → {opt.product}
                        </p>
                        <p className="text-[10px] text-muted">
                          {opt.ready ? 'Crop ready now' : `Crop ready in ${opt.daysLeft}d`}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-green flex-shrink-0">{opt.value.toLocaleString()}g</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Crafting */}
          {craftable.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted mb-2">
                <Hammer size={10} strokeWidth={1.75} />Crafting (you have enough materials)
              </p>
              <div className="space-y-2">
                {craftable.map((item) => (
                  <div key={item.name}
                    className="bg-white border border-parchment rounded-2xl px-4 py-3 flex items-center gap-3"
                    style={{ boxShadow: 'var(--shadow-card)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-ink">{item.name}</p>
                        <span className="text-[10px] bg-cream-dark text-muted px-1.5 py-0.5 rounded-full">
                          ×{item.canMake}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted">{item.desc}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-muted">
                        {Object.entries(item.req).map(([r, n]) => `${n} ${r}`).join(' · ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {artisanOpts.length === 0 && craftable.length === 0 && (
            <EmptyCard text="No processing or crafting opportunities right now." />
          )}
        </section>
      )}

      {/* ═══════════════ FISHING ══════════════════════════════════════════ */}
      <section>
        <SectionHeader title={`Fish this ${currentSeason}`} Icon={FishIcon} />
        <div className="bg-white border border-parchment rounded-2xl p-4"
          style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-ink">
              {uncaughtFish.length} left
              <span className="text-muted font-normal"> of {seasonFish.length}</span>
            </p>
            {uncaughtFish.some((f) => f.legendary) && (
              <span className="text-[11px] bg-brown/10 text-brown px-2 py-0.5 rounded-full font-medium">
                {uncaughtFish.filter((f) => f.legendary).length} legendary
              </span>
            )}
          </div>
          <div className="h-1.5 w-full bg-cream-dark rounded-full overflow-hidden mb-4">
            <div className="h-full rounded-full bg-green transition-all duration-500"
              style={{ width: `${seasonFish.length ? ((seasonFish.length - uncaughtFish.length) / seasonFish.length) * 100 : 0}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {seasonFish.map((f) => {
              const done = caughtIds.has(f.id)
              return (
                <div key={f.id} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${done ? 'opacity-40' : ''}`}>
                  {done
                    ? <Check size={11} className="text-green flex-shrink-0" />
                    : <div className="w-2.5 h-2.5 rounded-full border border-parchment flex-shrink-0" />
                  }
                  <span className={`${done ? 'line-through text-muted' : 'text-ink font-medium'} truncate`}>
                    {f.name}
                  </span>
                  {f.legendary && !done && <span className="text-[9px] text-brown font-bold flex-shrink-0">★</span>}
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}

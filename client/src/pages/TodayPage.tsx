import { useEffect, useState } from 'react'
import { VILLAGER_BIRTHDAYS, SEASONAL_EVENTS, FISH, CROPS } from '@shared'
import type { GardenEntry, CaughtFish, Season } from '@shared'
import { supabase } from '../api/supabase'
import { useAppStore } from '../store/useAppStore'
import { useUserId } from '../hooks/useUserId'
import { villagerSprite, cropSprite } from '../data/sprites'
import {
  Gift, Star, Wheat, Fish as FishIcon, Check,
  type LucideIcon,
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
  const curAbs = (year - 1) * 112 + yearAbs(season, day)
  const plantAbs = (entry.planted_year - 1) * 112 + yearAbs(entry.season, entry.day)
  const elapsed = curAbs - plantAbs
  if (elapsed >= crop.growDays) return { crop, ready: true, daysLeft: 0 }
  const daysLeft = crop.growDays - elapsed
  return { crop, ready: false, daysLeft }
}

// ── sub-components ─────────────────────────────────────────────────────────────

function SectionHeader({ title, Icon }: { title: string; Icon: LucideIcon }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={12} className="text-muted" strokeWidth={1.75} />
      <p className="text-[11px] uppercase tracking-widest text-muted font-medium">{title}</p>
    </div>
  )
}

// ── main page ──────────────────────────────────────────────────────────────────

export default function TodayPage() {
  const userId = useUserId()
  const { currentDay, currentSeason, currentYear } = useAppStore()
  const [entries, setEntries]   = useState<GardenEntry[]>([])
  const [caught, setCaught]     = useState<CaughtFish[]>([])
  const [cropsLoading, setCropsLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    setCropsLoading(true)
    Promise.all([
      supabase.from('garden_entries').select('*').eq('user_id', userId).eq('harvested', false),
      supabase.from('caught_fish').select('*').eq('user_id', userId),
    ]).then(([gardenRes, fishRes]) => {
      setEntries((gardenRes.data as GardenEntry[]) ?? [])
      setCaught((fishRes.data as CaughtFish[]) ?? [])
      setCropsLoading(false)
    })
  }, [userId])

  const markHarvested = async (entry: GardenEntry) => {
    if (!userId) return
    await supabase
      .from('garden_entries')
      .update({ harvested: true, updated_at: new Date().toISOString() })
      .eq('id', entry.id)
    setEntries((prev) => prev.filter((e) => e.id !== entry.id))
  }

  const s = SEASON_STYLE[currentSeason]

  // Birthdays
  const todayBirthday = VILLAGER_BIRTHDAYS.find(
    (v) => v.season === currentSeason && v.day === currentDay,
  )
  const upcomingBirthdays = VILLAGER_BIRTHDAYS
    .map((v) => ({ ...v, in: daysUntil(v.season, v.day, currentSeason, currentDay) }))
    .filter((v) => v.in > 0 && v.in <= 7)
    .sort((a, b) => a.in - b.in)

  // Festivals
  const upcomingFestivals = SEASONAL_EVENTS
    .map((e) => ({ ...e, in: daysUntil(e.season, e.day, currentSeason, currentDay) }))
    .filter((e) => e.in > 0 && e.in <= 14)
    .sort((a, b) => a.in - b.in)

  // Crops
  const cropInfos = entries
    .map((e) => ({ entry: e, info: getCropInfo(e, currentYear, currentSeason, currentDay) }))
    .filter((x) => x.info !== null) as { entry: GardenEntry; info: NonNullable<ReturnType<typeof getCropInfo>> }[]

  const readyCrops = cropInfos.filter((x) => x.info.ready)
  const soonCrops  = cropInfos
    .filter((x) => !x.info.ready && x.info.daysLeft <= 3)
    .sort((a, b) => a.info.daysLeft - b.info.daysLeft)

  // Fish
  const seasonFish = FISH.filter((f) => f.seasons.includes(currentSeason))
  const caughtIds  = new Set(caught.filter((c) => c.caught).map((c) => c.fish_id))
  const uncaughtFish = seasonFish.filter((f) => !caughtIds.has(f.id))
  const legendaryLeft = uncaughtFish.filter((f) => f.legendary)

  const allClear = !todayBirthday && upcomingBirthdays.length === 0 &&
    readyCrops.length === 0 && soonCrops.length === 0 &&
    upcomingFestivals.length === 0

  return (
    <div className="p-4 md:p-8 max-w-2xl space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-ink">Today</h2>
        <p className={`text-sm mt-0.5 capitalize font-medium ${s.text}`}>
          {currentSeason} {currentDay}, Year {currentYear}
        </p>
      </div>

      {/* ── Birthday today ─────────────────────────────────────────── */}
      {todayBirthday && (
        <div
          className="bg-brown-pale border border-brown/20 rounded-2xl p-5 flex items-start gap-4"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          {villagerSprite(todayBirthday.name)
            ? <img src={villagerSprite(todayBirthday.name)!} alt={todayBirthday.name}
                width={48} style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                referrerPolicy="no-referrer" />
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

      {/* ── Upcoming birthdays ──────────────────────────────────────── */}
      {upcomingBirthdays.length > 0 && (
        <div>
          <SectionHeader title="Birthdays soon" Icon={Gift} />
          <div className="space-y-2">
            {upcomingBirthdays.map((v) => (
              <div key={v.name}
                className="bg-white border border-parchment rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{ boxShadow: 'var(--shadow-card)' }}>
                {villagerSprite(v.name)
                  ? <img src={villagerSprite(v.name)!} alt={v.name}
                      width={28} style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                      referrerPolicy="no-referrer" />
                  : <div className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center flex-shrink-0">
                      <Gift size={12} className="text-muted" />
                    </div>
                }
                <p className="font-medium text-ink text-sm flex-1">{v.name}</p>
                <span className={`text-xs font-semibold ${s.text}`}>
                  {v.in === 1 ? 'Tomorrow' : `in ${v.in} days`}
                </span>
                <span className="text-[11px] text-muted capitalize w-16 text-right">{v.season} {v.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Crops ──────────────────────────────────────────────────── */}
      {userId ? (
        (readyCrops.length > 0 || soonCrops.length > 0) && (
          <div>
            <SectionHeader title="Your crops" Icon={Wheat} />
            {cropsLoading ? (
              <p className="text-sm text-muted">Loading…</p>
            ) : (
              <div className="space-y-2">
                {readyCrops.map(({ entry, info }) => (
                  <div key={entry.id}
                    className="bg-white border border-green/25 rounded-2xl px-4 py-3 flex items-center gap-3"
                    style={{ boxShadow: 'var(--shadow-card)' }}>
                    {cropSprite(entry.crop_id) && (
                      <img src={cropSprite(entry.crop_id)!} alt={info.crop.name}
                        width={28} style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                        referrerPolicy="no-referrer" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink text-sm">{info.crop.name}</p>
                      <p className="text-[11px] text-green font-medium">Ready to harvest</p>
                    </div>
                    <button
                      onClick={() => markHarvested(entry)}
                      className="flex items-center gap-1.5 text-xs bg-green hover:bg-green-light text-cream px-3 py-1.5 rounded-lg font-medium transition-colors flex-shrink-0"
                    >
                      <Check size={11} />Harvest
                    </button>
                  </div>
                ))}

                {soonCrops.map(({ entry, info }) => (
                  <div key={entry.id}
                    className="bg-white border border-parchment rounded-2xl px-4 py-3 flex items-center gap-3"
                    style={{ boxShadow: 'var(--shadow-card)' }}>
                    {cropSprite(entry.crop_id) && (
                      <img src={cropSprite(entry.crop_id)!} alt={info.crop.name}
                        width={28} style={{ imageRendering: 'pixelated', flexShrink: 0, opacity: 0.7 }}
                        referrerPolicy="no-referrer" />
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
              </div>
            )}
          </div>
        )
      ) : null}

      {/* ── Upcoming festivals ─────────────────────────────────────── */}
      {upcomingFestivals.length > 0 && (
        <div>
          <SectionHeader title="Upcoming festivals" Icon={Star} />
          <div className="space-y-2">
            {upcomingFestivals.map((e) => (
              <div key={e.name}
                className="bg-white border border-parchment rounded-2xl px-4 py-3"
                style={{ boxShadow: 'var(--shadow-card)' }}>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <p className="font-semibold text-ink text-sm">{e.name}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold ${s.text}`}>
                      {e.in === 1 ? 'Tomorrow' : `in ${e.in} days`}
                    </span>
                    <span className="text-[11px] text-muted capitalize">{e.season} {e.day}</span>
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed">{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Fish this season ───────────────────────────────────────── */}
      <div>
        <SectionHeader title={`Fish this ${currentSeason}`} Icon={FishIcon} />
        <div className="bg-white border border-parchment rounded-2xl p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-ink">
              {uncaughtFish.length} left to catch
              <span className="text-muted font-normal"> of {seasonFish.length}</span>
            </p>
            {legendaryLeft.length > 0 && (
              <span className="text-[11px] bg-brown/10 text-brown px-2 py-0.5 rounded-full font-medium">
                {legendaryLeft.length} legendary
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-cream-dark rounded-full overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-500 ${SEASON_STYLE[currentSeason].soft.replace('bg-', 'bg-').replace('/10', '')}`}
              style={{ width: `${seasonFish.length ? ((seasonFish.length - uncaughtFish.length) / seasonFish.length) * 100 : 0}%`, backgroundColor: 'var(--color-green)' }}
            />
          </div>

          {/* Fish list — show all, caught ones faded */}
          <div className="grid grid-cols-2 gap-1.5">
            {seasonFish.map((f) => {
              const done = caughtIds.has(f.id)
              return (
                <div key={f.id}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-all ${
                    done ? 'opacity-40' : ''
                  }`}>
                  {done
                    ? <Check size={11} className="text-green flex-shrink-0" />
                    : <div className="w-2.5 h-2.5 rounded-full border border-parchment flex-shrink-0" />
                  }
                  <span className={`${done ? 'line-through text-muted' : 'text-ink font-medium'} truncate`}>
                    {f.name}
                  </span>
                  {f.legendary && !done && (
                    <span className="text-[9px] text-brown font-bold flex-shrink-0">★</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── All clear ──────────────────────────────────────────────── */}
      {allClear && (
        <div className="bg-cream-dark rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-3">
            <Check size={22} className="text-green" strokeWidth={2} />
          </div>
          <p className="font-semibold text-ink mb-1">All clear today</p>
          <p className="text-muted text-sm">No birthdays, crops, or festivals in the next few days.</p>
        </div>
      )}

    </div>
  )
}

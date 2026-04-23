import { useAppStore } from '../store/useAppStore'
import type { Season } from '@shared'

const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

const SEASON_STYLE: Record<Season, string> = {
  spring: 'bg-spring text-white',
  summer: 'bg-summer text-white',
  fall:   'bg-fall text-white',
  winter: 'bg-winter text-white',
}

const SEASON_TEXT: Record<Season, string> = {
  spring: 'text-spring', summer: 'text-summer', fall: 'text-fall', winter: 'text-winter',
}

interface Props {
  onClose: () => void
}

export default function DateSheet({ onClose }: Props) {
  const { currentDay, currentSeason, currentYear, setDay, setSeason, setYear, saveSettings } = useAppStore()

  const handleSave = () => {
    saveSettings()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-3xl px-6 pt-5 pb-10 shadow-2xl">
        {/* Handle */}
        <div className="w-10 h-1 bg-parchment rounded-full mx-auto mb-5" />

        <p className="text-base font-semibold text-ink mb-5">Set in-game date</p>

        {/* Season */}
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-widest text-muted mb-2">Season</p>
          <div className="grid grid-cols-4 gap-1.5">
            {SEASONS.map((s) => (
              <button
                key={s}
                onClick={() => setSeason(s)}
                className={`py-2 rounded-xl text-sm capitalize font-medium transition-all ${
                  currentSeason === s ? SEASON_STYLE[s] : 'bg-cream-dark text-muted'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Day */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] uppercase tracking-widest text-muted">Day</p>
            <span className={`text-lg font-bold ${SEASON_TEXT[currentSeason]}`}>{currentDay}</span>
          </div>
          <input
            type="range" min={1} max={28} value={currentDay}
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-full accent-green h-2"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>1</span><span>7</span><span>14</span><span>21</span><span>28</span>
          </div>
        </div>

        {/* Year */}
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-widest text-muted mb-2">Year</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setYear(Math.max(1, currentYear - 1))}
              className="w-10 h-10 rounded-xl bg-cream-dark text-ink font-bold text-lg flex items-center justify-center"
            >
              −
            </button>
            <span className="flex-1 text-center text-xl font-bold text-ink">Year {currentYear}</span>
            <button
              onClick={() => setYear(currentYear + 1)}
              className="w-10 h-10 rounded-xl bg-cream-dark text-ink font-bold text-lg flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-green hover:bg-green-light text-cream font-semibold py-3 rounded-2xl transition-colors"
        >
          Save date
        </button>
      </div>
    </div>
  )
}

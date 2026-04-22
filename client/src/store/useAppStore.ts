import { create } from 'zustand'
import type { Season, UserSettings } from '@shared'
import { supabase, USER_ID } from '../api/supabase'

interface AppState {
  currentDay: number
  currentSeason: Season
  currentYear: number
  settingsLoaded: boolean
  setDay: (day: number) => void
  setSeason: (season: Season) => void
  setYear: (year: number) => void
  loadSettings: () => Promise<void>
  saveSettings: () => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  currentDay: 1,
  currentSeason: 'spring',
  currentYear: 1,
  settingsLoaded: false,

  setDay: (day) => set({ currentDay: day }),
  setSeason: (season) => set({ currentSeason: season }),
  setYear: (year) => set({ currentYear: year }),

  loadSettings: async () => {
    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', USER_ID)
      .single<UserSettings>()

    if (data) {
      set({
        currentDay: data.current_day,
        currentSeason: data.current_season,
        currentYear: data.current_year,
        settingsLoaded: true,
      })
    } else {
      set({ settingsLoaded: true })
    }
  },

  saveSettings: async () => {
    const { currentDay, currentSeason, currentYear } = get()
    await supabase.from('user_settings').upsert({
      user_id: USER_ID,
      current_day: currentDay,
      current_season: currentSeason,
      current_year: currentYear,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
  },
}))

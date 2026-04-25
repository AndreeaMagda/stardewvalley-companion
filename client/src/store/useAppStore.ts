import { create } from 'zustand'
import type { Season, UserSettings } from '@shared'
import { supabase } from '../api/supabase'

interface AppState {
  userId: string | null
  userName: string | null
  userAvatar: string | null
  currentDay: number
  currentSeason: Season
  currentYear: number
  settingsLoaded: boolean
  setUserId: (id: string | null) => void
  setUserMeta: (name: string | null, avatar: string | null) => void
  setDay: (day: number) => void
  setSeason: (season: Season) => void
  setYear: (year: number) => void
  loadSettings: () => Promise<void>
  saveSettings: () => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  userId: null,
  userName: null,
  userAvatar: null,
  currentDay: 1,
  currentSeason: 'spring',
  currentYear: 1,
  settingsLoaded: false,

  setUserId: (id) => set({ userId: id }),
  setUserMeta: (name, avatar) => set({ userName: name, userAvatar: avatar }),
  setDay: (day) => set({ currentDay: day }),
  setSeason: (season) => set({ currentSeason: season }),
  setYear: (year) => set({ currentYear: year }),

  loadSettings: async () => {
    const { userId } = get()
    if (!userId) return
    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
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
    const { userId, currentDay, currentSeason, currentYear } = get()
    if (!userId) return
    await supabase.from('user_settings').upsert({
      user_id: userId,
      current_day: currentDay,
      current_season: currentSeason,
      current_year: currentYear,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
  },
}))

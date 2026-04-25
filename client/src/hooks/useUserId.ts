import { useAppStore } from '../store/useAppStore'

export function useUserId(): string | null {
  return useAppStore((s) => s.userId)
}

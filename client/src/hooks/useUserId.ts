import { useAppStore } from '../store/useAppStore'

export function useUserId(): string {
  return useAppStore((s) => s.userId) as string
}

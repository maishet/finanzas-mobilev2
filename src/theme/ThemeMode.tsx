import { createContext, useContext } from 'react'

export type ThemeMode = 'light' | 'dark'

interface ThemeModeContextValue {
  themeMode: ThemeMode
  toggleThemeMode: () => void
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

export function useThemeMode() {
  const value = useContext(ThemeModeContext)
  if (!value) throw new Error('useThemeMode must be used inside AppProviders')
  return value
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider, ToastViewport } from '@tamagui/toast'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { Platform, useColorScheme } from 'react-native'
import { TamaguiProvider, Theme, type TamaguiProviderProps } from 'tamagui'
import { config } from '../../tamagui.config'
import '../i18n'
import { AuthProvider } from '../auth/AuthProvider'
import { ThemeModeContext, type ThemeMode } from '../theme/ThemeMode'
import { CurrentToast } from '../ui/CurrentToast'

const themeModeStorageKey = 'fint-theme-mode'

export function AppProviders({ children, ...rest }: Omit<TamaguiProviderProps, 'config' | 'defaultTheme'>) {
  const colorScheme = useColorScheme()
  const [queryClient] = useState(() => new QueryClient())
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => (colorScheme === 'dark' ? 'dark' : 'light'))

  const toggleThemeMode = () => {
    setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    let isMounted = true

    async function loadThemeMode() {
      const storedThemeMode = await getStoredThemeMode()
      if (isMounted && storedThemeMode) setThemeMode(storedThemeMode)
    }

    loadThemeMode()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    storeThemeMode(themeMode)
  }, [themeMode])

  return (
    <ThemeModeContext.Provider value={{ themeMode, toggleThemeMode }}>
      <TamaguiProvider config={config} defaultTheme={themeMode} {...rest}>
        <ToastProvider swipeDirection="horizontal" duration={5000}>
          <Theme name={themeMode} forceClassName>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>{children}</AuthProvider>
            </QueryClientProvider>
          </Theme>
          <CurrentToast />
          <ToastViewport top="$8" left={0} right={0} />
        </ToastProvider>
      </TamaguiProvider>
    </ThemeModeContext.Provider>
  )
}

async function getStoredThemeMode() {
  const value = Platform.OS === 'web' ? window.localStorage.getItem(themeModeStorageKey) : await SecureStore.getItemAsync(themeModeStorageKey)
  return value === 'light' || value === 'dark' ? value : null
}

async function storeThemeMode(themeMode: ThemeMode) {
  if (Platform.OS === 'web') {
    window.localStorage.setItem(themeModeStorageKey, themeMode)
    return
  }

  await SecureStore.setItemAsync(themeModeStorageKey, themeMode)
}

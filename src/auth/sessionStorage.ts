import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const memoryStorage = new Map<string, string>()

function canUseLocalStorage() {
  return Platform.OS === 'web' && typeof window !== 'undefined' && !!window.localStorage
}

export const sessionStorage = {
  async getItem(key: string) {
    if (canUseLocalStorage()) return window.localStorage.getItem(key)
    if (Platform.OS === 'web') return memoryStorage.get(key) ?? null
    return SecureStore.getItemAsync(key)
  },
  async setItem(key: string, value: string) {
    if (canUseLocalStorage()) {
      window.localStorage.setItem(key, value)
      return
    }
    if (Platform.OS === 'web') {
      memoryStorage.set(key, value)
      return
    }
    await SecureStore.setItemAsync(key, value)
  },
  async removeItem(key: string) {
    if (canUseLocalStorage()) {
      window.localStorage.removeItem(key)
      return
    }
    if (Platform.OS === 'web') {
      memoryStorage.delete(key)
      return
    }
    await SecureStore.deleteItemAsync(key)
  },
}

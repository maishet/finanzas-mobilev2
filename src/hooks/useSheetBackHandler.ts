import { useEffect } from 'react'
import { BackHandler, Platform } from 'react-native'

export function useSheetBackHandler(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (Platform.OS !== 'android' || !open) return

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose()
      return true
    })

    return () => subscription.remove()
  }, [onClose, open])
}

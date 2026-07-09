import { Toast, useToastState } from '@tamagui/toast'
import { isWeb, YStack } from 'tamagui'

export function CurrentToast() {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) return null

  return (
    <Toast key={currentToast.id} duration={currentToast.duration} viewportName={currentToast.viewportName} enterStyle={{ opacity: 0, scale: 0.9, y: -20 }} exitStyle={{ opacity: 0, scale: 0.95, y: -10 }} y={isWeb ? '$12' : 0} rounded="$6">
      <YStack p="$3" gap="$1">
        <Toast.Title fontWeight="700">{currentToast.title}</Toast.Title>
        {currentToast.message ? <Toast.Description>{currentToast.message}</Toast.Description> : null}
      </YStack>
    </Toast>
  )
}

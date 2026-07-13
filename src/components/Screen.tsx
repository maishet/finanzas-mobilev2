import { RefreshControl } from 'react-native'
import { ScrollView, YStack, type YStackProps } from 'tamagui'

interface ScreenProps extends YStackProps {
  isRefreshing?: boolean
  onRefresh?: () => void
}

export function Screen({ isRefreshing = false, onRefresh, ...props }: ScreenProps) {
  return (
    <ScrollView
      flex={1}
      bg="$background"
      refreshControl={onRefresh ? <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} /> : undefined}
    >
      <YStack gap="$4" p="$4" pb="$8" {...props} />
    </ScrollView>
  )
}

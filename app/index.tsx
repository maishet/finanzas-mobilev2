import { Redirect } from 'expo-router'
import { Spinner, YStack } from 'tamagui'
import { useAuth } from '../src/auth/AuthProvider'

export default function IndexScreen() {
  const { isLoading, session } = useAuth()

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" bg="$background">
        <Spinner size="large" color="$accent10" />
      </YStack>
    )
  }

  return <Redirect href={session ? '/(tabs)/dashboard' : '/login'} />
}

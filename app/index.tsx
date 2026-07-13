import { useQuery } from '@tanstack/react-query'
import { Redirect } from 'expo-router'
import { Spinner, YStack } from 'tamagui'
import { ApiRequestError } from '../src/api/client'
import { financeApi } from '../src/api/finance'
import { useAuth } from '../src/auth/AuthProvider'

export default function IndexScreen() {
  const { isLoading, session } = useAuth()
  const meQuery = useQuery({ queryKey: ['me'], queryFn: financeApi.getMe, enabled: !!session, retry: false })

  if (isLoading || (!!session && meQuery.isLoading)) {
    return (
      <YStack flex={1} items="center" justify="center" bg="$background">
        <Spinner size="large" color="$accent10" />
      </YStack>
    )
  }

  const shouldReturnToLogin = !session || (meQuery.error instanceof ApiRequestError && meQuery.error.status === 401)

  return <Redirect href={shouldReturnToLogin ? '/login' : '/(tabs)/dashboard'} />
}

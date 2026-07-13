import { useQuery } from '@tanstack/react-query'
import { Link } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { H2, Paragraph, XStack } from 'tamagui'
import { financeApi } from '../../src/api/finance'
import { formatMoney, normalizeTransaction } from '../../src/api/mappers'
import { DataStateCard } from '../../src/components/DataStateCard'
import { Screen } from '../../src/components/Screen'
import { FintButton, FintCard } from '../../src/ui'

export default function MovementsScreen() {
  const { t } = useTranslation()
  const movementsQuery = useQuery({ queryKey: ['transactions'], queryFn: () => financeApi.listTransactions(), retry: false })
  const movements = (movementsQuery.data ?? []).map(normalizeTransaction)

  return (
    <Screen isRefreshing={movementsQuery.isRefetching} onRefresh={() => movementsQuery.refetch()}>
      <XStack items="center" justify="space-between" gap="$3">
        <H2 size="$7" color="$color12" fontFamily="$heading" flex={1}>{t('tabs.movements')}</H2>
        <Link href="/transaction-form" asChild><FintButton size="$3">{t('actions.newMovement')}</FintButton></Link>
      </XStack>
      {movementsQuery.isLoading ? <DataStateCard message={t('states.loading')} /> : null}
      {movementsQuery.error ? <DataStateCard message={movementsQuery.error instanceof Error ? movementsQuery.error.message : t('states.error')} /> : null}
      {!movementsQuery.isLoading && !movementsQuery.error && movements.length === 0 ? <DataStateCard message={t('empty.movements')} /> : null}
      {!movementsQuery.isLoading && !movementsQuery.error ? movements.map((movement) => (
        <FintCard key={movement.id} gap="$2">
          <XStack justify="space-between" gap="$3">
            <Paragraph color="$color12" fontSize="$4" fontWeight="800" flex={1} numberOfLines={1}>{movement.category}</Paragraph>
            <Paragraph color={movement.type === 'expense' ? '$red10' : '$green10'} fontSize="$3" fontWeight="800">{formatMoney(movement.amount, movement.currency)}</Paragraph>
          </XStack>
          <Paragraph color="$color10" fontSize="$3">{movement.account}</Paragraph>
        </FintCard>
      )) : null}
    </Screen>
  )
}

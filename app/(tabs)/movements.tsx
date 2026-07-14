import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Plus, Shapes } from '@tamagui/lucide-icons-2'
import { Link } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Paragraph, XStack, YStack } from 'tamagui'
import { financeApi } from '../../src/api/finance'
import { formatMoney, normalizeTransaction } from '../../src/api/mappers'
import type { TransactionType } from '../../src/api/types'
import { DataStateCard } from '../../src/components/DataStateCard'
import { Screen } from '../../src/components/Screen'
import { FintButton, FintCard } from '../../src/ui'

type TypeFilter = 'all' | TransactionType

function isoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function monthRange(month: Date) {
  const from = new Date(month.getFullYear(), month.getMonth(), 1)
  const to = new Date(month.getFullYear(), month.getMonth() + 1, 1)
  return { from: isoDate(from), to: isoDate(to) }
}

export default function MovementsScreen() {
  const { t, i18n } = useTranslation()
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const range = monthRange(month)
  const movementsQuery = useQuery({
    queryKey: ['transactions', range.from, range.to],
    queryFn: () => financeApi.listTransactions({ ...range, limit: 200 }),
    retry: false,
  })
  const movements = (movementsQuery.data ?? []).map(normalizeTransaction).filter((movement) => typeFilter === 'all' || movement.type === typeFilter)
  const rawMonthLabel = new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(month)
  const monthLabel = rawMonthLabel.charAt(0).toLocaleUpperCase(i18n.language) + rawMonthLabel.slice(1)

  const changeMonth = (offset: number) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }

  return (
    <Screen isRefreshing={movementsQuery.isRefetching} onRefresh={() => movementsQuery.refetch()}>
      <XStack items="center" justify="space-between" gap="$3">
        <YStack gap="$1" flex={1}>
          <Paragraph color="$color12" fontFamily="$heading" fontSize="$7" fontWeight="700">{t('movements.historyTitle')}</Paragraph>
          <Paragraph color="$color10">{t('movements.historySubtitle')}</Paragraph>
        </YStack>
        <Link href="/categories" asChild>
          <Button circular bg="$secondary" borderColor="$borderColor" borderWidth={1} icon={<Shapes size={20} color="$primary" />} aria-label={t('categories.routeTitle')} />
        </Link>
        <Link href="/transaction-form" asChild>
          <Button circular bg="$primary" icon={<Plus size={22} color="$primaryForeground" />} aria-label={t('actions.newMovement')} />
        </Link>
      </XStack>

      <FintCard py="$2">
        <XStack items="center" justify="space-between">
          <Button circular chromeless icon={<ChevronLeft size={22} />} onPress={() => changeMonth(-1)} aria-label={t('movements.previousMonth')} />
          <Paragraph color="$color12" fontFamily="$heading" fontSize="$5" fontWeight="700">{monthLabel}</Paragraph>
          <Button circular chromeless icon={<ChevronRight size={22} />} onPress={() => changeMonth(1)} aria-label={t('movements.nextMonth')} />
        </XStack>
      </FintCard>

      <XStack gap="$2">
        {(['all', 'expense', 'income'] as const).map((option) => (
          <FintButton key={option} flex={1} size="$3" variant={typeFilter === option ? 'solid' : 'outlined'} onPress={() => setTypeFilter(option)}>
            {t(`movements.filters.${option}`)}
          </FintButton>
        ))}
      </XStack>

      {movementsQuery.isLoading ? <DataStateCard message={t('states.loading')} /> : null}
      {movementsQuery.error ? (
        <FintCard gap="$3" items="center">
          <Paragraph color="$red10" text="center">{t('movements.loadError')}</Paragraph>
          <FintButton size="$3" variant="outlined" onPress={() => movementsQuery.refetch()}>{t('actions.retry')}</FintButton>
        </FintCard>
      ) : null}
      {!movementsQuery.isLoading && !movementsQuery.error && movements.length === 0 ? (
        <FintCard gap="$3" items="center" py="$6">
          <Paragraph color="$color12" fontFamily="$heading" fontSize="$5" fontWeight="700">{t('movements.emptyTitle')}</Paragraph>
          <Paragraph color="$color10" text="center">{t('movements.emptyDescription')}</Paragraph>
          <Link href="/transaction-form" asChild><FintButton>{t('actions.newMovement')}</FintButton></Link>
        </FintCard>
      ) : null}
      {!movementsQuery.isLoading && !movementsQuery.error ? movements.map((movement) => (
        <FintCard key={movement.id} gap="$2" py="$3">
          <XStack items="center" justify="space-between" gap="$3">
            <YStack flex={1} minW={0} gap="$1">
              <Paragraph color="$color12" fontSize="$4" fontWeight="800" numberOfLines={1}>{movement.category}</Paragraph>
              <Paragraph color="$color10" fontSize="$2" numberOfLines={1}>{movement.account} · {new Intl.DateTimeFormat(i18n.language, { day: '2-digit', month: 'short' }).format(new Date(`${movement.date}T00:00:00`))}</Paragraph>
            </YStack>
            <Paragraph color={movement.type === 'expense' ? '$red10' : '$green10'} fontSize="$3" fontWeight="800">
              {formatMoney(movement.type === 'expense' ? -movement.amount : movement.amount, movement.currency)}
            </Paragraph>
          </XStack>
          {movement.note ? <Paragraph color="$color10" fontSize="$2" numberOfLines={2}>{movement.note}</Paragraph> : null}
        </FintCard>
      )) : null}
    </Screen>
  )
}

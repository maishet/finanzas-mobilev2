import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowDown, ArrowLeftRight, ArrowUp, ChevronDown, ChevronUp, Mail, Plus, Shapes, Trash2 } from '@tamagui/lucide-icons-2'
import { Link } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Paragraph, Spinner, XStack, YStack } from 'tamagui'
import { financeApi } from '../../src/api/finance'
import { supabase } from '../../src/auth/supabase'
import { formatMoney, normalizeTransaction } from '../../src/api/mappers'
import type { Category, PendingMovement } from '../../src/api/types'
import { CategoryPickerSheet } from '../../src/components/CategoryPickerSheet'
import { DataStateCard } from '../../src/components/DataStateCard'
import { Screen } from '../../src/components/Screen'
import { getCategoryLabel } from '../../src/finance/categoryLabels'
import { suggestedCategoryIcons } from '../../src/finance/categoryIcons'
import { FintButton, FintCard, FintSheetSelect } from '../../src/ui'

function isoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function monthRange(month: Date) {
  return { from: isoDate(new Date(month.getFullYear(), month.getMonth(), 1)), to: isoDate(new Date(month.getFullYear(), month.getMonth() + 1, 1)) }
}

export default function MovementsScreen() {
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [pendingOpen, setPendingOpen] = useState(false)
  const [expandedPendingId, setExpandedPendingId] = useState<string | null>(null)
  const [pendingCategory, setPendingCategory] = useState('')
  const range = monthRange(month)
  const movementsQuery = useQuery({ queryKey: ['transactions', range.from, range.to], queryFn: () => financeApi.listTransactions({ ...range, limit: 200 }), retry: false })
  const pendingQuery = useQuery({ queryKey: ['pending-movements'], queryFn: () => financeApi.listPendingMovements(50), retry: false })
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: () => financeApi.listCategories(), retry: false })
  const movements = (movementsQuery.data ?? []).map(normalizeTransaction)
  const pending = (pendingQuery.data ?? []).filter((item) => item.status === 'pending')
  const currency = movements[0]?.currency ?? 'PEN'
  const income = movements.filter((item) => item.type === 'income' && item.currency === currency).reduce((sum, item) => sum + item.amount, 0)
  const expenses = movements.filter((item) => item.type === 'expense' && item.currency === currency).reduce((sum, item) => sum + item.amount, 0)
  const monthOptions = Array.from({ length: 18 }, (_, index) => {
    const date = new Date(new Date().getFullYear(), new Date().getMonth() - index, 1)
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(date)
    return { value, label: label.charAt(0).toLocaleUpperCase(i18n.language) + label.slice(1) }
  })
  const monthValue = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null
    let active = true
    supabase.auth.getUser().then(({ data }) => {
      if (!active || !data.user) return
      channel = supabase
        .channel(`pending-movements-${data.user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'pending_movements', filter: `user_id=eq.${data.user.id}` }, () => queryClient.invalidateQueries({ queryKey: ['pending-movements'] }))
        .subscribe()
    })
    return () => {
      active = false
      if (channel) supabase.removeChannel(channel)
    }
  }, [queryClient])

  const confirmMutation = useMutation({
    mutationFn: ({ id, category }: { id: string; category: string }) => financeApi.confirmPendingMovement(id, { category }),
    onSuccess: async () => {
      setExpandedPendingId(null)
      setPendingCategory('')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pending-movements'] }),
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
        queryClient.invalidateQueries({ queryKey: ['accounts'] }),
      ])
    },
  })
  const discardMutation = useMutation({
    mutationFn: (id: string) => financeApi.discardPendingMovement(id),
    onSuccess: async () => {
      setExpandedPendingId(null)
      await queryClient.invalidateQueries({ queryKey: ['pending-movements'] })
    },
  })

  return (
    <Screen isRefreshing={movementsQuery.isRefetching || pendingQuery.isRefetching} onRefresh={() => Promise.all([movementsQuery.refetch(), pendingQuery.refetch(), categoriesQuery.refetch()])}>
      <MovementHero currency={currency} expenses={expenses} income={income} />

      <XStack gap="$3">
        <Link href={{ pathname: '/transaction-form', params: { type: 'income' } }} asChild><FintButton flex={1} bg="$green9" icon={<ArrowUp size={17} color="white" />}>{t('actions.newIncome')}</FintButton></Link>
        <Link href={{ pathname: '/transaction-form', params: { type: 'expense' } }} asChild><FintButton flex={1} bg="$red9" icon={<ArrowDown size={17} color="white" />}>{t('actions.newExpense')}</FintButton></Link>
      </XStack>

      <FintSheetSelect
        label={t('movementUx.period')}
        value={monthValue}
        placeholder={t('movementUx.selectMonth')}
        options={monthOptions}
        onValueChange={(value) => { const [year, selectedMonth] = value.split('-').map(Number); setMonth(new Date(year, selectedMonth - 1, 1)) }}
      />

      <FintCard p={0} overflow="hidden" borderColor={pending.length ? '$yellow7' : '$borderColor'}>
        <XStack items="center" gap="$3" p="$3" bg={pending.length ? '$yellow2' : '$muted'} role="button" onPress={() => setPendingOpen((current) => !current)}>
          <Mail size={19} color={pending.length ? '$yellow10' : '$color10'} />
          <Paragraph flex={1} color={pending.length ? '$yellow11' : '$color10'} fontWeight="800">{t('movementUx.pendingCount', { count: pending.length })}</Paragraph>
          {pendingOpen ? <ChevronUp size={18} color="$color10" /> : <ChevronDown size={18} color="$color10" />}
        </XStack>
        {pendingOpen ? (
          <YStack gap="$2" p="$2">
            {pendingQuery.isLoading ? <Spinner color="$primary" /> : null}
            {pendingQuery.error ? <Paragraph color="$red10">{t('movementUx.pendingError')}</Paragraph> : null}
            {!pendingQuery.isLoading && pending.length === 0 ? <Paragraph color="$color10" p="$2">{t('movementUx.noPending')}</Paragraph> : null}
            {pending.map((item) => (
              <PendingCard
                key={item.id}
                item={item}
                expanded={expandedPendingId === item.id}
                category={pendingCategory}
                categories={(categoriesQuery.data ?? []).filter((category) => category.type === item.type)}
                isPending={confirmMutation.isPending || discardMutation.isPending}
                onToggle={() => { setExpandedPendingId((current) => current === item.id ? null : item.id); setPendingCategory('') }}
                onCategoryChange={setPendingCategory}
                onConfirm={() => confirmMutation.mutate({ id: item.id, category: pendingCategory })}
                onDiscard={() => discardMutation.mutate(item.id)}
              />
            ))}
          </YStack>
        ) : null}
      </FintCard>

      <XStack items="center" justify="space-between" gap="$3">
        <YStack gap="$1">
          <Paragraph color="$color12" fontFamily="$heading" fontSize="$6" fontWeight="700">{t('movementUx.movementCount', { count: movements.length })}</Paragraph>
          <Paragraph color="$color10" fontSize="$2">{t('movements.historySubtitle')}</Paragraph>
        </YStack>
        <Link href="/categories" asChild><Button circular bg="$secondary" icon={<Shapes size={20} color="$primary" />} aria-label={t('categories.routeTitle')} /></Link>
        <Link href="/transaction-form" asChild><Button circular bg="$primary" icon={<Plus size={21} color="$primaryForeground" />} aria-label={t('actions.newMovement')} /></Link>
      </XStack>

      {movementsQuery.isLoading ? <DataStateCard message={t('states.loading')} /> : null}
      {movementsQuery.error ? <DataStateCard message={t('movements.loadError')} /> : null}
      {!movementsQuery.isLoading && !movementsQuery.error && movements.length === 0 ? <DataStateCard message={t('movements.emptyDescription')} /> : null}
      {!movementsQuery.isLoading && !movementsQuery.error ? movements.map((movement) => {
        const category = (categoriesQuery.data ?? []).find((item) => item.type === movement.type && item.name === movement.category)
        const isIncome = movement.type === 'income'
        return (
          <FintCard key={movement.id} py="$3">
            <XStack items="center" gap="$3">
              <YStack width={42} height={42} rounded="$8" bg={isIncome ? '$green2' : '$red2'} items="center" justify="center"><Paragraph fontSize="$5">{category?.icon || suggestedCategoryIcons(movement.category, movement.type)[0]}</Paragraph></YStack>
              <YStack flex={1} minW={0} gap="$1">
                <Paragraph color="$color12" fontSize="$3" fontWeight="800" numberOfLines={1}>{getCategoryLabel(movement.category, t)}</Paragraph>
                <Paragraph color="$color10" fontSize="$1" numberOfLines={1}>{new Intl.DateTimeFormat(i18n.language, { day: '2-digit', month: 'short' }).format(new Date(`${movement.date}T00:00:00`))} · {movement.account}</Paragraph>
                {movement.note ? <Paragraph color="$color10" fontSize="$1" numberOfLines={1}>{movement.note}</Paragraph> : null}
              </YStack>
              <Paragraph color={isIncome ? '$green10' : '$red10'} fontSize="$3" fontWeight="900">{isIncome ? '+' : '-'}{formatMoney(movement.amount, movement.currency)}</Paragraph>
            </XStack>
          </FintCard>
        )
      }) : null}
    </Screen>
  )
}

function MovementHero({ currency, expenses, income }: { currency: string; expenses: number; income: number }) {
  const { t } = useTranslation()
  return (
    <FintCard bg="#0F5D73" borderColor="#28788C" gap="$4" p="$4">
      <XStack items="center" justify="space-between">
        <YStack gap="$1"><Paragraph color="#B9D7E1" fontFamily="$heading" fontSize="$2" fontWeight="700" textTransform="uppercase">{t('movementUx.monthFlow')}</Paragraph><Paragraph color="#F4FBFD" fontSize="$8" fontWeight="900">{formatMoney(income - expenses, currency)}</Paragraph></YStack>
        <YStack width={48} height={48} rounded="$10" bg="rgba(93,214,229,0.14)" items="center" justify="center"><ArrowLeftRight size={24} color="#5DD6E5" /></YStack>
      </XStack>
      <XStack gap="$3"><HeroMetric label={t('dashboard.totalIncome')} value={formatMoney(income, currency)} color="#5DD6E5" /><HeroMetric label={t('dashboard.totalExpenses')} value={formatMoney(expenses, currency)} color="#F28B82" /></XStack>
    </FintCard>
  )
}

function HeroMetric({ color, label, value }: { color: string; label: string; value: string }) {
  return <YStack flex={1} gap="$1"><YStack height={4} rounded="$10" bg={color as never} /><Paragraph color="#B9D7E1" fontSize="$1">{label}</Paragraph><Paragraph color="#F4FBFD" fontSize="$3" fontWeight="800">{value}</Paragraph></YStack>
}

function PendingCard({ categories, category, expanded, isPending, item, onCategoryChange, onConfirm, onDiscard, onToggle }: { categories: Category[]; category: string; expanded: boolean; isPending: boolean; item: PendingMovement; onCategoryChange: (value: string) => void; onConfirm: () => void; onDiscard: () => void; onToggle: () => void }) {
  const { t } = useTranslation()
  return (
    <FintCard bg="$card" p="$3" gap="$3">
      <XStack items="center" gap="$3" role="button" onPress={onToggle}>
        <Mail size={18} color="$primary" />
        <YStack flex={1} minW={0}><Paragraph color="$color12" fontWeight="800" numberOfLines={1}>{item.description || t('movementUx.detectedMovement')}</Paragraph><Paragraph color="$color10" fontSize="$1" numberOfLines={1}>{item.account || item.source}</Paragraph></YStack>
        <Paragraph color={item.type === 'income' ? '$green10' : '$red10'} fontWeight="900">{item.type === 'income' ? '+' : '-'}{formatMoney(item.amount, item.currency)}</Paragraph>
      </XStack>
      {expanded ? (
        <YStack gap="$3">
          <CategoryPickerSheet categories={categories} type={item.type} value={category} onValueChange={onCategoryChange} />
          <XStack gap="$2">
            <FintButton flex={1} variant="outlined" color="$red10" borderColor="$red6" disabled={isPending} icon={<Trash2 size={16} />} onPress={onDiscard}>{t('movementUx.discardPending')}</FintButton>
            <FintButton flex={1} disabled={isPending || !category} onPress={onConfirm}>{t('movementUx.confirmPending')}</FintButton>
          </XStack>
        </YStack>
      ) : null}
    </FintCard>
  )
}

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowDownLeft, ArrowUpRight, Landmark, Lightbulb, ReceiptText, Target } from '@tamagui/lucide-icons-2'
import { Link } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { PieChart } from 'react-native-gifted-charts'
import { Button, H3, Paragraph, ScrollView, Spinner, XStack, YStack } from 'tamagui'
import { apiRequest } from '../../src/api/client'
import {
  formatMoney,
  normalizeTransaction,
  normalizeSummary,
} from '../../src/api/mappers'
import type { Summary, Transaction } from '../../src/api/types'
import { Screen } from '../../src/components/Screen'
import { FintButton, FintCard } from '../../src/ui'

interface CategorySlice {
  name: string
  amount: number
  color: string
}

export default function DashboardScreen() {
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()
  const summaryQuery = useQuery({ queryKey: ['summary'], queryFn: () => apiRequest<Summary>('/api/summary'), retry: false })
  const transactionsQuery = useQuery({ queryKey: ['transactions', 'dashboard'], queryFn: () => apiRequest<Transaction[]>('/api/transactions?limit=40'), retry: false })

  const summary = normalizeSummary(summaryQuery.data)
  const transactions = (transactionsQuery.data ?? []).map(normalizeTransaction)
  const recentTransactions = transactions.slice(0, 4)
  const categorySlices = getExpenseCategorySlices(transactions)
  const isLoading = summaryQuery.isLoading || transactionsQuery.isLoading
  const isRefreshing = summaryQuery.isRefetching || transactionsQuery.isRefetching
  const error = summaryQuery.error ?? transactionsQuery.error
  const locale = i18n.language === 'en' ? 'en-US' : 'es-PE'
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(summary.year, summary.month - 1, 1))

  return (
    <Screen
      isRefreshing={isRefreshing}
      onRefresh={() => {
        queryClient.invalidateQueries({ queryKey: ['summary'] })
        queryClient.invalidateQueries({ queryKey: ['transactions'] })
      }}
    >
      {isLoading ? <LoadingCard message={t('dashboard.loading')} /> : null}
      {error ? <ErrorCard title={t('dashboard.errorTitle')} message={error instanceof Error ? error.message : t('dashboard.errorTitle')} /> : null}

      {!isLoading && !error ? (
        <>
          <HeroSummary
            currency={summary.currency}
            monthFlowLabel={t('dashboard.monthFlow')}
            monthLabel={monthLabel}
            netWorth={summary.netWorth}
            savings={summary.savings}
            totalBalanceLabel={t('dashboard.totalBalance')}
          />

          <QuickActions />

          <XStack gap="$3" flexWrap="wrap">
            <QuickMetric icon="income" label={t('dashboard.income')} value={formatMoney(summary.income, summary.currency)} />
            <QuickMetric icon="expense" label={t('dashboard.expenses')} value={formatMoney(summary.expenses, summary.currency)} />
            <QuickMetric icon="savings" label={t('dashboard.savings')} value={formatMoney(summary.savings, summary.currency)} />
            <QuickMetric icon="debts" label={t('tabs.debts')} value={formatMoney(summary.pendingDebtTotal, summary.currency)} />
          </XStack>

          <AdviceCarousel income={summary.income} expenses={summary.expenses} savings={summary.savings} transactionCount={transactions.length} />

          <ExpenseCategoryCard currency={summary.currency} slices={categorySlices} />

          <RecentMovements transactions={recentTransactions} />
        </>
      ) : null}
    </Screen>
  )
}

function HeroSummary({ currency, monthFlowLabel, monthLabel, netWorth, savings, totalBalanceLabel }: { currency: string; monthFlowLabel: string; monthLabel: string; netWorth: number; savings: number; totalBalanceLabel: string }) {
  const isPositive = savings >= 0

  return (
    <FintCard bg="$accent1" borderColor="$accent4" gap="$4" p="$5">
      <XStack items="center" justify="space-between" gap="$3">
        <YStack gap="$1" flex={1}>
          <Paragraph color="$accent11" fontSize="$3" fontWeight="800">{totalBalanceLabel}</Paragraph>
          <Paragraph color="$accent12" fontSize="$8" fontWeight="800" lineHeight="$8">
            {formatMoney(netWorth, currency)}
          </Paragraph>
          <Paragraph color="$color10" fontSize="$3">{monthLabel}</Paragraph>
        </YStack>
        <YStack width={56} height={56} rounded="$10" bg="$accent2" borderColor="$accent4" borderWidth={1} items="center" justify="center">
          <Landmark size={28} color="$accent9" />
        </YStack>
      </XStack>

      <XStack items="center" justify="space-between" bg="$color1" borderColor="$accent4" borderWidth={1} p="$3" rounded="$6">
        <Paragraph color="$color10" fontSize="$3" fontWeight="700">{monthFlowLabel}</Paragraph>
        <Paragraph color={isPositive ? '$green10' : '$red10'} fontSize="$3" fontWeight="800">
          {isPositive ? '+' : ''}{formatMoney(savings, currency)}
        </Paragraph>
      </XStack>
    </FintCard>
  )
}

function QuickActions() {
  const { t } = useTranslation()

  return (
    <FintCard gap="$3">
      <XStack gap="$3">
        <Link href={{ pathname: '/transaction-form', params: { type: 'income' } }} asChild>
          <FintButton flex={1} icon={<ArrowDownLeft size={16} color="$color1" />}>{t('actions.newIncome')}</FintButton>
        </Link>
        <Link href={{ pathname: '/transaction-form', params: { type: 'expense' } }} asChild>
          <FintButton flex={1} variant="outlined" icon={<ArrowUpRight size={16} color="$accent10" />}>{t('actions.newExpense')}</FintButton>
        </Link>
      </XStack>
    </FintCard>
  )
}

function QuickMetric({ icon, label, value }: { icon: 'income' | 'expense' | 'savings' | 'debts'; label: string; value: string }) {
  const isIncome = icon === 'income'
  const isExpense = icon === 'expense'
  const iconColor = isIncome ? '$green10' : isExpense || icon === 'debts' ? '$red10' : '$accent10'
  const Icon = isIncome ? ArrowDownLeft : isExpense ? ArrowUpRight : icon === 'debts' ? ReceiptText : Target

  return (
    <FintCard flex={1} minW={150} gap="$3">
      <XStack items="center" justify="space-between">
        <Paragraph color="$color10" fontSize="$3" fontWeight="700">{label}</Paragraph>
        <Icon size={18} color={iconColor} />
      </XStack>
      <Paragraph color="$color12" fontSize="$5" fontWeight="800" lineHeight="$5">
        {value}
      </Paragraph>
    </FintCard>
  )
}

function AdviceCarousel({ expenses, income, savings, transactionCount }: { expenses: number; income: number; savings: number; transactionCount: number }) {
  const { t } = useTranslation()
  const advice = [
    transactionCount === 0 ? t('dashboard.firstMoveTip') : null,
    income <= 0 ? t('dashboard.noIncomeTip') : null,
    expenses > income && income > 0 ? t('dashboard.highExpenseTip') : null,
    savings >= 0 && transactionCount > 0 ? t('dashboard.savingStatus') : null,
    savings < 0 ? t('dashboard.deficitStatus') : null,
  ].filter(Boolean) as string[]
  const items = advice.length > 0 ? advice : [t('dashboard.firstMoveTip')]

  return (
    <YStack gap="$3">
      <H3 color="$color12" size="$6">{t('dashboard.recommendations')}</H3>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        {items.map((item, index) => (
          <FintCard key={`${item}-${index}`} width={260} bg="$accent1" borderColor="$accent4" gap="$3">
            <XStack items="center" gap="$2">
              <Lightbulb size={18} color="$accent9" />
              <Paragraph color="$accent11" fontSize="$3" fontWeight="800">Fint tip</Paragraph>
            </XStack>
            <Paragraph color="$color10" fontSize="$3" lineHeight="$5">{item}</Paragraph>
          </FintCard>
        ))}
      </ScrollView>
    </YStack>
  )
}

function ExpenseCategoryCard({ currency, slices }: { currency: string; slices: CategorySlice[] }) {
  const { t } = useTranslation()
  const total = slices.reduce((sum, slice) => sum + slice.amount, 0)

  return (
    <FintCard gap="$4">
      <H3 color="$color12" size="$6">{t('dashboard.spendingByCategory')}</H3>
      {slices.length === 0 ? (
        <Paragraph color="$color10">{t('dashboard.emptyCategories')}</Paragraph>
      ) : (
        <XStack items="center" gap="$5">
          <DonutChart slices={slices} total={total} />
          <YStack flex={1} gap="$2">
            {slices.slice(0, 4).map((slice) => (
              <XStack key={slice.name} items="center" justify="space-between" gap="$2">
                <XStack items="center" gap="$2" flex={1}>
                  <YStack width={9} height={9} rounded="$10" bg={slice.color as never} />
                  <Paragraph color="$color10" fontSize="$2" numberOfLines={1}>{slice.name}</Paragraph>
                </XStack>
                <Paragraph color="$color12" fontSize="$2" fontWeight="800">{formatMoney(slice.amount, currency)}</Paragraph>
              </XStack>
            ))}
          </YStack>
        </XStack>
      )}
    </FintCard>
  )
}

function DonutChart({ slices, total }: { slices: CategorySlice[]; total: number }) {
  const mainSlice = slices[0]
  const mainPercent = total > 0 && mainSlice ? Math.round((mainSlice.amount / total) * 100) : 0
  const chartData = slices.map((slice) => ({ value: slice.amount, color: slice.color }))

  return (
    <YStack width={122} height={122} items="center" justify="center">
      <PieChart
        data={chartData}
        donut
        radius={54}
        innerRadius={34}
        sectionAutoFocus={false}
        showGradient={false}
        strokeWidth={2}
        strokeColor="rgba(255,255,255,0.72)"
        innerCircleColor="transparent"
        backgroundColor="transparent"
      />
      <YStack position="absolute" width={70} height={70} rounded="$12" bg="$color2" borderColor="$color5" borderWidth={1} items="center" justify="center">
        <Paragraph color="$color12" fontSize="$7" fontWeight="900">{mainPercent}%</Paragraph>
        <Paragraph color="$color9" fontSize="$1" numberOfLines={1} maxW={64} text="center">
          {mainSlice?.name ?? ''}
        </Paragraph>
      </YStack>
    </YStack>
  )
}

function RecentMovements({ transactions }: { transactions: Transaction[] }) {
  const { t } = useTranslation()

  return (
    <FintCard gap="$4">
      <XStack items="center" justify="space-between" gap="$3">
        <H3 color="$color12" size="$6" flex={1}>{t('dashboard.recentActivity')}</H3>
        <Link href="/(tabs)/movements" asChild>
          <Button chromeless size="$2" px="$2">
            <Paragraph color="$accent10" fontWeight="800" fontSize="$2">{t('actions.viewAll')}</Paragraph>
          </Button>
        </Link>
      </XStack>
      {transactions.length === 0 ? (
        <Paragraph color="$color10">{t('dashboard.emptyMovements')}</Paragraph>
      ) : (
        <YStack gap="$3">
          {transactions.map((transaction) => {
            const type = transaction.type
            const isIncome = type === 'income'
            return (
              <XStack key={transaction.id} items="center" justify="space-between" gap="$3">
                <XStack items="center" gap="$3" flex={1} minW={0}>
                  <YStack width={36} height={36} rounded="$8" bg={isIncome ? '$green2' : '$red2'} items="center" justify="center">
                    {isIncome ? <ArrowDownLeft size={18} color="$green10" /> : <ArrowUpRight size={18} color="$red10" />}
                  </YStack>
                  <YStack flex={1} minW={0}>
                    <Paragraph color="$color12" fontSize="$3" fontWeight="800" numberOfLines={1}>{transaction.category}</Paragraph>
                    <Paragraph color="$color9" fontSize="$2" numberOfLines={1}>{transaction.account}</Paragraph>
                  </YStack>
                </XStack>
                <Paragraph color={isIncome ? '$green10' : '$red10'} fontWeight="800">
                  {isIncome ? '+' : '-'}{formatMoney(transaction.amount, transaction.currency)}
                </Paragraph>
              </XStack>
            )
          })}
        </YStack>
      )}
    </FintCard>
  )
}

function getExpenseCategorySlices(transactions: Transaction[]) {
  const colors = ['#2A7FA8', '#4B9A8A', '#C28A42', '#7B75B8', '#C76574', '#5797A6']
  const totals = new Map<string, number>()

  for (const transaction of transactions) {
    if (transaction.type !== 'expense') continue
    totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount)
  }

  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, amount], index) => ({ name, amount, color: colors[index % colors.length] }))
}

function LoadingCard({ message }: { message: string }) {
  return (
    <FintCard items="center" justify="center" gap="$3" minH={160}>
      <Spinner color="$accent10" size="large" />
      <Paragraph color="$color10">{message}</Paragraph>
    </FintCard>
  )
}

function ErrorCard({ message, title }: { message: string; title: string }) {
  return (
    <FintCard bg="$red2" borderColor="$red6" gap="$2">
      <Paragraph color="$red11" fontWeight="800">{title}</Paragraph>
      <Paragraph color="$red11">{message}</Paragraph>
    </FintCard>
  )
}

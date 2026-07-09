import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { H2, Paragraph } from 'tamagui'
import { apiRequest } from '../../src/api/client'
import { formatMoney, normalizeDebt } from '../../src/api/mappers'
import type { Debt } from '../../src/api/types'
import { DataStateCard } from '../../src/components/DataStateCard'
import { Screen } from '../../src/components/Screen'
import { FintCard } from '../../src/ui'

export default function DebtsScreen() {
  const { t } = useTranslation()
  const debtsQuery = useQuery({ queryKey: ['debts'], queryFn: () => apiRequest<Debt[]>('/api/debts'), retry: false })
  const debts = (debtsQuery.data ?? []).map(normalizeDebt)

  return (
    <Screen isRefreshing={debtsQuery.isRefetching} onRefresh={() => debtsQuery.refetch()}>
      <H2 size="$7" color="$color12">{t('tabs.debts')}</H2>
      {debts.length === 0 ? <DataStateCard message={t('empty.debts')} /> : debts.map((debt) => (
        <FintCard key={debt.id} gap="$2">
          <Paragraph color="$color12" fontSize="$4" fontWeight="800">{debt.description}</Paragraph>
          <Paragraph color="$color10" fontSize="$3">{formatMoney(debt.outstanding, debt.currency)} · {debt.status}</Paragraph>
        </FintCard>
      ))}
    </Screen>
  )
}

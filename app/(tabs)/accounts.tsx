import { useQuery } from '@tanstack/react-query'
import { Link } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { H2, Paragraph, XStack } from 'tamagui'
import { financeApi } from '../../src/api/finance'
import { formatMoney, normalizeAccount } from '../../src/api/mappers'
import { DataStateCard } from '../../src/components/DataStateCard'
import { Screen } from '../../src/components/Screen'
import { FintButton, FintCard } from '../../src/ui'

export default function AccountsScreen() {
  const { t } = useTranslation()
  const accountsQuery = useQuery({ queryKey: ['accounts'], queryFn: financeApi.listAccounts, retry: false })
  const accounts = (accountsQuery.data ?? []).map(normalizeAccount)

  return (
    <Screen isRefreshing={accountsQuery.isRefetching} onRefresh={() => accountsQuery.refetch()}>
      <XStack items="center" justify="space-between" gap="$3">
        <H2 size="$7" color="$color12" fontFamily="$heading" flex={1}>{t('tabs.accounts')}</H2>
        <Link href="/account-form" asChild><FintButton size="$3">{t('actions.newAccount')}</FintButton></Link>
      </XStack>
      {accountsQuery.isLoading ? <DataStateCard message={t('states.loading')} /> : null}
      {accountsQuery.error ? <DataStateCard message={accountsQuery.error instanceof Error ? accountsQuery.error.message : t('states.error')} /> : null}
      {!accountsQuery.isLoading && !accountsQuery.error && accounts.length === 0 ? <DataStateCard message={t('empty.accounts')} /> : null}
      {!accountsQuery.isLoading && !accountsQuery.error ? accounts.map((account) => (
        <FintCard key={account.id} gap="$2">
          <Paragraph color="$color12" fontSize="$4" fontWeight="800">{account.name}</Paragraph>
          <Paragraph color="$color10" fontSize="$3">{account.accountType} · {formatMoney(account.balance, account.currency)}</Paragraph>
        </FintCard>
      )) : null}
    </Screen>
  )
}

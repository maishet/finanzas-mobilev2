import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowDown, ArrowUp, Save } from '@tamagui/lucide-icons-2'
import { useToastController } from '@tamagui/toast'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Paragraph, Spinner, XStack, YStack } from 'tamagui'
import { z } from 'zod'
import { financeApi } from '../src/api/finance'
import { Screen } from '../src/components/Screen'
import { CategoryPickerSheet } from '../src/components/CategoryPickerSheet'
import { FintButton, FintCard, FintDateField, FintInput, FintSheetSelect } from '../src/ui'
import { todayDateString } from '../src/finance/dates'

const transactionSchema = z.object({
  type: z.union([z.literal('income'), z.literal('expense')]),
  amount: z.number().positive(),
  currency: z.string().length(3),
  category: z.string().min(2),
  account: z.string().min(2),
  note: z.string().optional(),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export default function TransactionFormScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const params = useLocalSearchParams<{ type?: 'income' | 'expense' }>()
  const toast = useToastController()
  const queryClient = useQueryClient()
  const [type, setType] = useState<'income' | 'expense'>(params.type === 'income' ? 'income' : 'expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [account, setAccount] = useState('')
  const [note, setNote] = useState('')
  const [transactionDate, setTransactionDate] = useState(todayDateString)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const accountsQuery = useQuery({ queryKey: ['accounts'], queryFn: financeApi.listAccounts, retry: false })
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: () => financeApi.listCategories(), retry: false })
  const accounts = accountsQuery.data ?? []
  const categories = (categoriesQuery.data ?? []).filter((item) => item.type === type)
  const selectedAccount = accounts.find((item) => item.name === account)

  useEffect(() => {
    if (!account && accounts[0]) setAccount(accounts[0].name)
  }, [account, accounts])

  useEffect(() => {
    if (category && !categories.some((item) => item.name === category)) setCategory('')
  }, [categories, category])

  const mutation = useMutation({
    mutationFn: async () => {
      setErrorMessage(null)
      const payload = transactionSchema.parse({
        type,
        amount: Number(amount),
        currency: selectedAccount?.currency,
        category,
        account,
        note: note.trim() || undefined,
        transactionDate,
      })
      return financeApi.createTransaction(payload)
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
        queryClient.invalidateQueries({ queryKey: ['accounts'] }),
      ])
      toast.show(t('movements.createdToast'), { message: t('movements.createdMessage') })
      router.back()
    },
    onError: (error) => setErrorMessage(error instanceof z.ZodError ? t('movements.invalidForm') : error.message),
  })

  const isReferenceLoading = accountsQuery.isLoading || categoriesQuery.isLoading

  return (
    <>
    <Stack.Screen options={{ title: t(type === 'income' ? 'movementUx.newIncomeTitle' : 'movementUx.newExpenseTitle') }} />
    <Screen>
      <Paragraph color="$color10" fontSize="$4">{t('movements.formSubtitle')}</Paragraph>

      <FintCard gap="$5">
        <XStack gap="$1" bg="$muted" rounded={14} p="$1">
          {(['expense', 'income'] as const).map((option) => (
            <FintButton
              key={option}
              flex={1}
              variant="solid"
              bg={type === option ? option === 'income' ? '$green9' : '$red9' : 'transparent'}
              color={type === option ? 'white' : '$color11'}
              borderWidth={0}
              icon={option === 'income' ? <ArrowUp size={16} color={type === option ? 'white' : '$color10'} /> : <ArrowDown size={16} color={type === option ? 'white' : '$color10'} />}
              onPress={() => {
                setType(option)
                setErrorMessage(null)
              }}
            >
              {t(`forms.${option}`)}
            </FintButton>
          ))}
        </XStack>

        <YStack gap="$2">
          <Paragraph color="$color10" fontWeight="600">{t('forms.amount')}</Paragraph>
          <FintInput minH={64} fontSize="$7" fontWeight="800" placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
        </YStack>

        {accounts.length > 0 ? (
          <FintSheetSelect
            label={t('forms.account')}
            placeholder={t('movements.selectAccount')}
            value={account}
            onValueChange={setAccount}
            options={accounts.map((item) => ({ value: item.name, label: `${item.name} · ${item.currency}` }))}
          />
        ) : null}

        <CategoryPickerSheet categories={categories} type={type} value={category} onValueChange={setCategory} />

        <FintDateField label={t('movements.date')} placeholder={t('movements.selectDate')} value={transactionDate} onValueChange={setTransactionDate} />
        <FintInput placeholder={t('forms.note')} value={note} onChangeText={setNote} />

        {isReferenceLoading ? <Paragraph color="$color10">{t('movements.loadingReferences')}</Paragraph> : null}
        {!accountsQuery.isLoading && accounts.length === 0 ? (
          <FintCard bg="$secondary" gap="$2">
            <Paragraph color="$color12" fontWeight="700">{t('movements.noAccounts')}</Paragraph>
            <FintButton size="$3" variant="outlined" onPress={() => router.push('/account-form')}>{t('actions.newAccount')}</FintButton>
          </FintCard>
        ) : null}
        {!categoriesQuery.isLoading && categories.length === 0 ? (
          <FintCard bg="$secondary" gap="$2">
            <Paragraph color="$color12" fontWeight="700">{t('movements.noCategories')}</Paragraph>
            <FintButton size="$3" variant="outlined" onPress={() => router.push('/categories')}>{t('categories.newAction')}</FintButton>
          </FintCard>
        ) : null}
        {accountsQuery.error || categoriesQuery.error ? <Paragraph color="$red10">{t('movements.referencesError')}</Paragraph> : null}
        {errorMessage ? <Paragraph color="$red10">{errorMessage}</Paragraph> : null}

        <FintButton
          disabled={mutation.isPending || isReferenceLoading || !selectedAccount || !category}
          icon={mutation.isPending ? <Spinner color="$primaryForeground" /> : <Save size={18} />}
          onPress={() => mutation.mutate()}
          bg={type === 'income' ? '$green9' : '$red9'}
        >
          {mutation.isPending ? t('movements.creating') : t(type === 'income' ? 'movementUx.registerIncome' : 'movementUx.registerExpense')}
        </FintButton>
      </FintCard>
    </Screen>
    </>
  )
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, Save } from '@tamagui/lucide-icons-2'
import { useToastController } from '@tamagui/toast'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Paragraph, Spinner, XStack, YStack } from 'tamagui'
import { z } from 'zod'
import { financeApi } from '../src/api/finance'
import { Screen } from '../src/components/Screen'
import { FintButton, FintCard, FintInput, FintSheetSelect } from '../src/ui'

const transactionSchema = z.object({
  type: z.union([z.literal('income'), z.literal('expense')]),
  amount: z.number().positive(),
  currency: z.string().length(3),
  category: z.string().min(2),
  account: z.string().min(2),
  note: z.string().optional(),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

function today() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

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
  const [transactionDate, setTransactionDate] = useState(today)
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
    if (!categories.some((item) => item.name === category)) setCategory(categories[0]?.name ?? '')
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
    <Screen>
      <Paragraph color="$color10" fontSize="$4">{t('movements.formSubtitle')}</Paragraph>

      <FintCard gap="$4">
        <XStack gap="$2">
          {(['expense', 'income'] as const).map((option) => (
            <FintButton
              key={option}
              flex={1}
              variant={type === option ? 'solid' : 'outlined'}
              onPress={() => {
                setType(option)
                setErrorMessage(null)
              }}
            >
              {t(`forms.${option}`)}
            </FintButton>
          ))}
        </XStack>

        <FintInput placeholder={t('forms.amount')} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />

        {accounts.length > 0 ? (
          <FintSheetSelect
            label={t('forms.account')}
            placeholder={t('movements.selectAccount')}
            value={account}
            onValueChange={setAccount}
            options={accounts.map((item) => ({ value: item.name, label: `${item.name} · ${item.currency}` }))}
          />
        ) : null}

        {categories.length > 0 ? (
          <FintSheetSelect
            label={t('forms.category')}
            placeholder={t('movements.selectCategory')}
            value={category}
            onValueChange={setCategory}
            options={categories.map((item) => ({ value: item.name, label: `${item.icon || '•'} ${item.name}` }))}
          />
        ) : null}

        <XStack items="center" gap="$2">
          <CalendarDays size={18} color="$color10" />
          <FintInput flex={1} placeholder="YYYY-MM-DD" value={transactionDate} onChangeText={setTransactionDate} keyboardType="numbers-and-punctuation" />
        </XStack>
        <FintInput placeholder={t('forms.note')} value={note} onChangeText={setNote} />

        {isReferenceLoading ? <Paragraph color="$color10">{t('movements.loadingReferences')}</Paragraph> : null}
        {!accountsQuery.isLoading && accounts.length === 0 ? (
          <FintCard bg="$secondary" gap="$2">
            <Paragraph color="$color12" fontWeight="700">{t('movements.noAccounts')}</Paragraph>
            <FintButton size="$3" variant="outlined" onPress={() => router.push('/(tabs)/accounts')}>{t('actions.newAccount')}</FintButton>
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
        >
          {mutation.isPending ? t('movements.creating') : t('actions.save')}
        </FintButton>
      </FintCard>
    </Screen>
  )
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToastController } from '@tamagui/toast'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { H2, Paragraph, XStack } from 'tamagui'
import { z } from 'zod'
import { apiRequest } from '../src/api/client'
import { Screen } from '../src/components/Screen'
import { FintButton, FintCard, FintInput } from '../src/ui'

const transactionSchema = z.object({
  type: z.union([z.literal('income'), z.literal('expense')]),
  amount: z.number().positive(),
  currency: z.string().min(3),
  category: z.string().min(2),
  account: z.string().min(2),
  note: z.string().optional(),
})

export default function TransactionFormScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const params = useLocalSearchParams<{ type?: 'income' | 'expense' }>()
  const toast = useToastController()
  const queryClient = useQueryClient()
  const [type, setType] = useState<'income' | 'expense'>(params.type === 'income' ? 'income' : 'expense')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('PEN')
  const [category, setCategory] = useState('General')
  const [account, setAccount] = useState('Efectivo')
  const [note, setNote] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = transactionSchema.parse({ type, amount: Number(amount), currency, category, account, note: note || undefined })
      return apiRequest('/api/transactions', { method: 'POST', body: JSON.stringify(payload) })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] })
      await queryClient.invalidateQueries({ queryKey: ['summary'] })
      toast.show('Movimiento creado')
      router.back()
    },
    onError: (error) => setErrorMessage(error.message),
  })

  return (
    <Screen>
      <H2 size="$7" color="$color12">{t('forms.newMovement')}</H2>
      <FintCard gap="$4">
        <XStack gap="$3">
          <FintButton flex={1} variant={type === 'expense' ? 'solid' : 'outlined'} onPress={() => setType('expense')}>{t('forms.expense')}</FintButton>
          <FintButton flex={1} variant={type === 'income' ? 'solid' : 'outlined'} onPress={() => setType('income')}>{t('forms.income')}</FintButton>
        </XStack>
        <FintInput placeholder={t('forms.amount')} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
        <FintInput placeholder={t('forms.currency')} value={currency} onChangeText={setCurrency} autoCapitalize="characters" />
        <FintInput placeholder={t('forms.category')} value={category} onChangeText={setCategory} />
        <FintInput placeholder={t('forms.account')} value={account} onChangeText={setAccount} />
        <FintInput placeholder={t('forms.note')} value={note} onChangeText={setNote} />
        {errorMessage ? <Paragraph color="$red10">{errorMessage}</Paragraph> : null}
        <FintButton disabled={mutation.isPending} onPress={() => mutation.mutate()}>{t('actions.save')}</FintButton>
      </FintCard>
    </Screen>
  )
}

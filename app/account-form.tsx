import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToastController } from '@tamagui/toast'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { H2, Paragraph } from 'tamagui'
import { z } from 'zod'
import { financeApi } from '../src/api/finance'
import { Screen } from '../src/components/Screen'
import { FintButton, FintCard, FintInput, FintSheetSelect } from '../src/ui'

const accountSchema = z.object({
  name: z.string().min(2),
  accountType: z.literal('cash'),
  currency: z.string().min(3),
  openingBalance: z.number(),
})

export default function AccountFormScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const toast = useToastController()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState('PEN')
  const [openingBalance, setOpeningBalance] = useState('0')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = accountSchema.parse({ name, accountType: 'cash', currency, openingBalance: Number(openingBalance) })
      return financeApi.createAccount(payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.show('Cuenta creada')
      router.back()
    },
    onError: (error) => setErrorMessage(error.message),
  })

  return (
    <Screen>
      <H2 size="$7" color="$color12" fontFamily="$heading">{t('forms.newAccount')}</H2>
      <FintCard gap="$4">
        <FintInput placeholder={t('forms.name')} value={name} onChangeText={setName} />
        <FintSheetSelect label={t('forms.accountType')} value={t('forms.cash')} />
        <FintInput placeholder={t('forms.currency')} value={currency} onChangeText={setCurrency} autoCapitalize="characters" />
        <FintInput placeholder={t('forms.openingBalance')} value={openingBalance} onChangeText={setOpeningBalance} keyboardType="decimal-pad" />
        {errorMessage ? <Paragraph color="$red10">{errorMessage}</Paragraph> : null}
        <FintButton disabled={mutation.isPending} onPress={() => mutation.mutate()}>{t('actions.save')}</FintButton>
      </FintCard>
    </Screen>
  )
}

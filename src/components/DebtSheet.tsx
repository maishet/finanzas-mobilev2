import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreditCard, Landmark, Save } from '@tamagui/lucide-icons-2'
import { useToastController } from '@tamagui/toast'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Paragraph, ScrollView, Sheet, Spinner, XStack, YStack } from 'tamagui'
import { z } from 'zod'
import { financeApi } from '../api/finance'
import { formatMoney } from '../api/mappers'
import type { Account, Debt } from '../api/types'
import { todayDateString } from '../finance/dates'
import { FintButton, FintDateField, FintInput } from '../ui'

const debtSchema = z.object({
  description: z.string().trim().min(2),
  amount: z.number().positive(),
  dueDate: z.string().date(),
  accountId: z.string().nullable(),
  note: z.string().trim().optional(),
})

interface DebtSheetProps {
  baseCurrency: string
  creditCards: Account[]
  debt?: Debt | null
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function DebtSheet({ baseCurrency, creditCards, debt, onOpenChange, open }: DebtSheetProps) {
  const { t } = useTranslation()
  const toast = useToastController()
  const queryClient = useQueryClient()
  const insets = useSafeAreaInsets()
  const isEditing = Boolean(debt)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState(todayDateString)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const selectedCard = creditCards.find((account) => account.id === accountId)
  const currency = selectedCard?.currency ?? debt?.currency ?? baseCurrency

  useEffect(() => {
    if (!open) return
    setDescription(debt?.description ?? '')
    setAmount(debt ? String(debt.originalAmount) : '')
    setDueDate(debt?.dueDate ?? todayDateString())
    setAccountId(debt?.accountId && creditCards.some((card) => card.id === debt.accountId) ? debt.accountId : null)
    setNote(debt?.note ?? '')
    setErrorMessage(null)
  }, [debt, open])

  const reset = () => {
    setDescription('')
    setAmount('')
    setDueDate(todayDateString())
    setAccountId(null)
    setNote('')
    setErrorMessage(null)
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = debtSchema.parse({ description, amount: Number(amount), dueDate, accountId, note: note || undefined })
      if (debt) return financeApi.updateDebt(debt.id, { description: payload.description, amount: payload.amount, dueDate: payload.dueDate, accountId: payload.accountId, note: payload.note ?? null })
      return financeApi.createDebt({ ...payload, currency })
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['debts'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
      ])
      onOpenChange(false)
      reset()
      toast.show(t(isEditing ? 'debts.updatedToast' : 'debts.createdToast'), { message: t(isEditing ? 'debts.updatedMessage' : 'debts.createdMessage'), preset: 'success', duration: 3500 })
    },
    onError: () => setErrorMessage(t('debts.saveError')),
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && mutation.isPending) return
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  return (
    <Sheet modal open={open} onOpenChange={handleOpenChange} snapPoints={[88]} moveOnKeyboardChange zIndex={100_000}>
      <Sheet.Overlay bg="rgba(4,18,28,0.64)" />
      <Sheet.Handle bg="$color5" />
      <Sheet.Frame bg="$popover" maxH="94%" px="$4" pt="$4" pb={Math.max(insets.bottom, 16)} rounded={18}>
        <Sheet.ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <YStack width="100%" gap="$5" pb="$4">
            <YStack gap="$1">
              <Paragraph color="$color12" fontFamily="$heading" fontSize="$7" fontWeight="700">{t(isEditing ? 'debts.editTitle' : 'debts.newTitle')}</Paragraph>
              <Paragraph color="$color10">{t(isEditing ? 'debts.editSubtitle' : 'debts.newSubtitle')}</Paragraph>
            </YStack>

            <DebtField label={t('forms.name')}>
              <FintInput width="100%" placeholder={t('debts.namePlaceholder')} value={description} onChangeText={setDescription} autoCapitalize="sentences" />
            </DebtField>

            <DebtField label={t('forms.amount')}>
              <FintInput width="100%" placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
            </DebtField>

            <FintDateField label={t('debts.dueDate')} placeholder={t('debts.selectDueDate')} value={dueDate} onValueChange={setDueDate} />

            <DebtField label={t('debts.creditCardOptional')}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                <CreditCardOption selected={accountId === null} title={t('debts.noCard')} subtitle={baseCurrency} onPress={() => setAccountId(null)} />
                {creditCards.map((card) => (
                  <CreditCardOption
                    key={card.id}
                    selected={accountId === card.id}
                    title={card.name}
                    subtitle={`${card.currency} · ${formatMoney(card.balance, card.currency)}`}
                    onPress={() => setAccountId(card.id)}
                  />
                ))}
              </ScrollView>
              {creditCards.length === 0 ? <Paragraph color="$color10" fontSize="$1">{t('debts.noCreditCards')}</Paragraph> : null}
            </DebtField>

            <DebtField label={t('debts.noteOptional')}>
              <FintInput width="100%" placeholder={t('debts.notePlaceholder')} value={note} onChangeText={setNote} multiline minH={72} textAlignVertical="top" />
            </DebtField>

            {errorMessage ? <Paragraph color="$red10">{errorMessage}</Paragraph> : null}
            <FintButton
              width="100%"
              height={50}
              disabled={mutation.isPending}
              icon={mutation.isPending ? <Spinner color="$primaryForeground" /> : isEditing ? <Save size={18} /> : <Landmark size={18} />}
              onPress={() => mutation.mutate()}
            >
              {mutation.isPending ? t(isEditing ? 'debts.updating' : 'debts.creating') : t(isEditing ? 'debts.update' : 'debts.create')}
            </FintButton>
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}

function DebtField({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <YStack width="100%" gap="$2">
      <Paragraph color="$color10" fontSize="$2" fontWeight="600">{label}</Paragraph>
      {children}
    </YStack>
  )
}

function CreditCardOption({ onPress, selected, subtitle, title }: { onPress: () => void; selected: boolean; subtitle: string; title: string }) {
  return (
    <XStack
      width={184}
      minH={70}
      items="center"
      gap="$3"
      p="$3"
      rounded="$6"
      bg={selected ? '$secondary' : '$muted'}
      borderColor={selected ? '$primary' : '$input'}
      borderWidth={1}
      pressStyle={{ opacity: 0.82 }}
      role="button"
      cursor="pointer"
      onPress={onPress}
    >
      <YStack width={34} height={34} rounded="$8" bg={selected ? '$primary' : '$card'} items="center" justify="center">
        <CreditCard size={18} color={selected ? '$primaryForeground' : '$primary'} />
      </YStack>
      <YStack flex={1} minW={0} gap="$1">
        <Paragraph color="$color12" fontWeight="700" numberOfLines={1}>{title}</Paragraph>
        <Paragraph color="$color10" fontSize="$1" numberOfLines={1}>{subtitle}</Paragraph>
      </YStack>
    </XStack>
  )
}

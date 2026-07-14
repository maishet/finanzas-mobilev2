import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, CreditCard, Landmark, PiggyBank, Save, Wallet } from '@tamagui/lucide-icons-2'
import { useToastController } from '@tamagui/toast'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Paragraph, Sheet, Spinner, XStack, YStack } from 'tamagui'
import { z } from 'zod'
import { financeApi } from '../api/finance'
import type { Account, AccountType } from '../api/types'
import { currencyOptions } from '../finance/currencies'
import { FintButton, FintInput, FintSheetSelect } from '../ui'

const accountDetailsSchema = z.object({
  name: z.string().trim().min(2),
  accountType: z.enum(['cash', 'credit_card', 'checking_account', 'savings_account']),
  currency: z.string().length(3),
})

interface AccountSheetProps {
  account?: Account | null
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function AccountSheet({ account, onOpenChange, open }: AccountSheetProps) {
  const { t } = useTranslation()
  const toast = useToastController()
  const queryClient = useQueryClient()
  const insets = useSafeAreaInsets()
  const isEditing = Boolean(account)
  const [name, setName] = useState('')
  const [accountType, setAccountType] = useState<AccountType>('cash')
  const [currency, setCurrency] = useState('PEN')
  const [openingBalance, setOpeningBalance] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const accountTypes = [
    { value: 'cash' as const, label: t('accountTypes.cash'), icon: Wallet },
    { value: 'checking_account' as const, label: t('accountTypes.checkingAccount'), icon: Building2 },
    { value: 'savings_account' as const, label: t('accountTypes.savingsAccount'), icon: PiggyBank },
    { value: 'credit_card' as const, label: t('accountTypes.creditCard'), icon: CreditCard },
  ]

  useEffect(() => {
    if (!open) return
    setName(account?.name ?? '')
    setAccountType(isAccountType(account?.accountType) ? account.accountType : 'cash')
    setCurrency(account?.currency ?? 'PEN')
    setOpeningBalance('')
    setErrorMessage(null)
  }, [account, open])

  const resetForm = () => {
    setName('')
    setAccountType('cash')
    setCurrency('PEN')
    setOpeningBalance('')
    setErrorMessage(null)
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const details = accountDetailsSchema.parse({ name, accountType, currency })
      if (account) return financeApi.updateAccount(account.id, details)
      const balance = z.number().finite().parse(Number(openingBalance || 0))
      return financeApi.createAccount({ ...details, openingBalance: balance })
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['accounts'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      ])
      onOpenChange(false)
      resetForm()
      toast.show(t(isEditing ? 'accounts.updatedToast' : 'accounts.createdToast'), {
        message: t(isEditing ? 'accounts.updatedMessage' : 'accounts.createdMessage'),
        preset: 'success',
        duration: 3500,
      })
    },
    onError: (error) => setErrorMessage(error instanceof Error ? error.message : t('states.error')),
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && mutation.isPending) return
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
  }

  return (
    <Sheet modal open={open} onOpenChange={handleOpenChange} snapPoints={[isEditing ? 66 : 80]} disableDrag moveOnKeyboardChange zIndex={100_000}>
      <Sheet.Overlay bg="rgba(4,18,28,0.62)" />
      <Sheet.Handle bg="$color5" />
      <Sheet.Frame bg="$popover" maxH="92%" px="$4" pt="$4" pb={Math.max(insets.bottom, 16)} rounded={18}>
        <Sheet.ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <YStack width="100%" gap="$5" pb="$3">
            <YStack gap="$1">
              <Paragraph color="$color12" fontFamily="$heading" fontSize="$7" fontWeight="700">{t(isEditing ? 'accounts.editTitle' : 'accounts.newTitle')}</Paragraph>
              <Paragraph color="$color10" fontSize="$3">{t(isEditing ? 'accounts.editSubtitle' : 'accounts.newSubtitle')}</Paragraph>
            </YStack>

            <FormField label={t('forms.name')}>
              <FintInput width="100%" placeholder={t('accounts.namePlaceholder')} value={name} onChangeText={setName} autoCapitalize="words" />
            </FormField>

            <FormField label={t('forms.accountType')}>
              <XStack width="100%" gap="$2" flexWrap="wrap">
                {accountTypes.map((option) => {
                  const isSelected = option.value === accountType
                  const Icon = option.icon
                  return (
                    <XStack
                      key={option.value}
                      width="48.5%"
                      minH={48}
                      items="center"
                      gap="$2"
                      px="$3"
                      py="$2"
                      rounded={14}
                      bg={isSelected ? '$primary' : '$muted'}
                      borderColor={isSelected ? '$primary' : '$input'}
                      borderWidth={1}
                      pressStyle={{ opacity: 0.8 }}
                      cursor="pointer"
                      role="button"
                      onPress={() => setAccountType(option.value)}
                      aria-label={option.label}
                    >
                      <Icon size={16} color={isSelected ? '$primaryForeground' : '$color10'} />
                      <Paragraph color={isSelected ? '$primaryForeground' : '$color12'} fontSize="$1" fontWeight="700" flex={1} numberOfLines={2}>
                        {option.label}
                      </Paragraph>
                    </XStack>
                  )
                })}
              </XStack>
            </FormField>

            {!isEditing ? (
              <FormField label={t('forms.openingBalance')}>
                <FintInput width="100%" placeholder="0.00" value={openingBalance} onChangeText={setOpeningBalance} keyboardType="decimal-pad" />
              </FormField>
            ) : null}

            <FintSheetSelect
              width="100%"
              label={t('forms.currency')}
              value={currency}
              options={currencyOptions}
              placeholder={t('forms.select')}
              searchable
              searchPlaceholder={t('accounts.searchCurrency')}
              onValueChange={setCurrency}
            />

            {errorMessage ? (
              <XStack bg="$red2" borderColor="$red6" borderWidth={1} rounded="$5" p="$3">
                <Paragraph color="$red11" fontSize="$2">{errorMessage}</Paragraph>
              </XStack>
            ) : null}

            <YStack width="100%" gap="$2">
              <FintButton
                width="100%"
                height={48}
                disabled={mutation.isPending}
                opacity={mutation.isPending ? 0.78 : 1}
                icon={mutation.isPending ? <Spinner size="small" color="$primaryForeground" /> : isEditing ? <Save size={17} color="$primaryForeground" /> : <Landmark size={17} color="$primaryForeground" />}
                onPress={() => mutation.mutate()}
              >
                {mutation.isPending ? t(isEditing ? 'accounts.updating' : 'accounts.creating') : t(isEditing ? 'accounts.update' : 'accounts.create')}
              </FintButton>
              <Button width="100%" chromeless height={42} color="$primary" fontWeight="700" disabled={mutation.isPending} onPress={() => handleOpenChange(false)}>
                {t('actions.cancel')}
              </Button>
            </YStack>
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}

function FormField({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <YStack width="100%" gap="$2">
      <Paragraph color="$color10" fontSize="$2" fontWeight="600">{label}</Paragraph>
      {children}
    </YStack>
  )
}

function isAccountType(value?: string): value is AccountType {
  return value === 'cash' || value === 'credit_card' || value === 'checking_account' || value === 'savings_account'
}

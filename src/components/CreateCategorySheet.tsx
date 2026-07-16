import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Shapes } from '@tamagui/lucide-icons-2'
import { useToastController } from '@tamagui/toast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Paragraph, Sheet, Spinner, XStack, YStack } from 'tamagui'
import EmojiPicker, { es, en, type EmojiType } from 'rn-emoji-keyboard'
import { financeApi } from '../api/finance'
import type { CreateCategoryResult, TransactionType } from '../api/types'
import { suggestedCategoryIcons } from '../finance/categoryIcons'
import { FintButton, FintInput } from '../ui'

interface CreateCategorySheetProps {
  initialType: TransactionType
  onCreated?: (category: CreateCategoryResult) => void
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function CreateCategorySheet({ initialType, onCreated, onOpenChange, open }: CreateCategorySheetProps) {
  const { t, i18n } = useTranslation()
  const toast = useToastController()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [type, setType] = useState<TransactionType>(initialType)
  const [icon, setIcon] = useState('🛒')
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [iconChanged, setIconChanged] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const reset = () => {
    setName('')
    setType(initialType)
    setIcon('🛒')
    setIconChanged(false)
    setErrorMessage(null)
  }

  const mutation = useMutation({
    mutationFn: () => {
      const categoryName = name.trim()
      if (categoryName.length < 2) throw new Error(t('categories.nameRequired'))
      return financeApi.createCategory({ name: categoryName, type, icon })
    },
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.show(t('categories.createdToast'), { message: t('categories.createdMessage') })
      reset()
      onOpenChange(false)
      onCreated?.(created)
    },
    onError: (error) => setErrorMessage(error instanceof Error ? error.message : t('states.error')),
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && mutation.isPending) return
    if (!nextOpen) reset()
    if (nextOpen) setType(initialType)
    onOpenChange(nextOpen)
  }

  return (
    <>
    <Sheet modal open={open} onOpenChange={handleOpenChange} snapPoints={[72]} disableDrag moveOnKeyboardChange zIndex={100_000}>
      <Sheet.Overlay bg="rgba(0,0,0,0.45)" />
      <Sheet.Handle bg="$color6" />
      <Sheet.Frame bg="$popover" px="$4" pt="$3" pb="$4" rounded={18}>
        <Sheet.ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <YStack gap="$4" pb="$2">
            <YStack gap="$1">
              <Paragraph color="$color12" fontFamily="$heading" fontSize="$7" fontWeight="700">{t('categories.newTitle')}</Paragraph>
              <Paragraph color="$color10">{t('categories.newSubtitle')}</Paragraph>
            </YStack>

            <XStack gap="$2">
              {(['expense', 'income'] as const).map((option) => (
                <FintButton key={option} flex={1} variant={type === option ? 'solid' : 'outlined'} onPress={() => setType(option)}>
                  {t(`forms.${option}`)}
                </FintButton>
              ))}
            </XStack>

            <YStack gap="$2">
              <Paragraph color="$color10" fontWeight="700">{t('categoryUx.identity')}</Paragraph>
              <XStack items="center" justify="center" gap="$2">
                <YStack width={74} height={74} rounded="$10" bg="$secondary" borderColor="$primary" borderWidth={1} items="center" justify="center"><Paragraph fontSize={38}>{icon}</Paragraph></YStack>
                <Button circular bg="$primary" icon={<Pencil size={16} color="$primaryForeground" />} onPress={() => setEmojiPickerOpen(true)} aria-label={t('categoryUx.changeEmoji')} />
              </XStack>
              <XStack gap="$2" flexWrap="wrap">
                {suggestedCategoryIcons(name, type).map((option) => (
                  <Button
                    key={option}
                    width={46}
                    height={46}
                    p={0}
                    rounded="$10"
                    bg={icon === option ? '$secondary' : '$muted'}
                    borderColor={icon === option ? '$primary' : '$borderColor'}
                    borderWidth={1}
                    onPress={() => { setIcon(option); setIconChanged(true) }}
                  >
                    {option}
                  </Button>
                ))}
              </XStack>
            </YStack>

            <FintInput placeholder={t('categories.namePlaceholder')} value={name} onChangeText={(value) => { setName(value); if (!iconChanged) setIcon(suggestedCategoryIcons(value, type)[0] ?? icon) }} autoCapitalize="sentences" />
            {errorMessage ? <Paragraph color="$red10">{errorMessage}</Paragraph> : null}

            <FintButton disabled={mutation.isPending} onPress={() => mutation.mutate()} icon={mutation.isPending ? <Spinner color="$background" /> : <Shapes size={18} />}>
              {mutation.isPending ? t('categories.creating') : t('categories.create')}
            </FintButton>
            <Button chromeless color="$primary" fontWeight="700" disabled={mutation.isPending} onPress={() => handleOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
    <EmojiPicker
      open={emojiPickerOpen}
      onClose={() => setEmojiPickerOpen(false)}
      onEmojiSelected={(emoji: EmojiType) => { setIcon(emoji.emoji); setIconChanged(true); setEmojiPickerOpen(false) }}
      translation={i18n.language === 'en' ? en : es}
      enableSearchBar
      enableRecentlyUsed
      categoryPosition="top"
    />
    </>
  )
}

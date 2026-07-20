import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Shapes, X } from '@tamagui/lucide-icons-2'
import { useToastController } from '@tamagui/toast'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import { Button, Paragraph, Sheet, Spinner, XStack, YStack } from 'tamagui'
import EmojiPicker, { es, en, type EmojiType } from 'rn-emoji-keyboard'
import { financeApi } from '../api/finance'
import type { CreateCategoryResult, TransactionType } from '../api/types'
import { suggestedCategoryIcons } from '../finance/categoryIcons'
import { useThemeMode } from '../theme/ThemeMode'
import { FintButton, FintInput } from '../ui'
import { useSheetBackHandler } from '../hooks/useSheetBackHandler'

interface CreateCategorySheetProps {
  initialType: TransactionType
  onCreated?: (category: CreateCategoryResult) => void
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function CreateCategorySheet({ initialType, onCreated, onOpenChange, open }: CreateCategorySheetProps) {
  const { t, i18n } = useTranslation()
  const { themeMode } = useThemeMode()
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
  const closeSheet = useCallback(() => {
    if (!mutation.isPending) handleOpenChange(false)
  }, [mutation.isPending, onOpenChange])
  useSheetBackHandler(open && !emojiPickerOpen, closeSheet)

  return (
    <>
    <Sheet modal open={open} onOpenChange={handleOpenChange} snapPoints={[76]} disableDrag moveOnKeyboardChange zIndex={120_000}>
      <Sheet.Overlay bg="rgba(0,0,0,0.45)" />
      <Sheet.Handle bg="$color6" />
      <Sheet.Frame bg="$popover" px="$4" pt="$3" pb="$4" rounded={18}>
        <Sheet.ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <YStack gap="$5" pb="$3">
            <XStack items="center" justify="space-between" gap="$3">
              <YStack flex={1} minW={0} gap="$1">
                <Paragraph color="$color12" fontFamily="$heading" fontSize="$7" fontWeight="700">{t('categories.newTitle')}</Paragraph>
                <Paragraph color="$color10">{t('categories.newSubtitle')}</Paragraph>
              </YStack>
              <Button circular chromeless size="$3" color="$primary" disabled={mutation.isPending} icon={<X size={20} color="$primary" />} onPress={() => handleOpenChange(false)} aria-label={t('actions.cancel')} />
            </XStack>

            <YStack items="center" gap="$3" minH={name.trim() ? undefined : 176} justify="center">
              <Paragraph color="$color10" fontWeight="700">{t('categoryUx.identity')}</Paragraph>
              <YStack width={108} height={108} rounded="$12" bg="$secondary" borderColor="$primary" borderWidth={2} items="center" justify="center" role="button" onPress={() => setEmojiPickerOpen(true)} aria-label={t('categoryUx.changeEmoji')} overflow="visible">
                <Text style={{ fontSize: 58, includeFontPadding: false, lineHeight: 70, textAlign: 'center', textAlignVertical: 'center' }}>{icon}</Text>
              </YStack>
              {name.trim() ? <XStack gap="$2" justify="center">
                {suggestedCategoryIcons(name, type).map((option) => (
                  <Button
                    key={option}
                    width={48}
                    height={48}
                    p={0}
                    rounded="$10"
                    bg={icon === option ? '$secondary' : '$muted'}
                    borderColor={icon === option ? '$primary' : '$borderColor'}
                    borderWidth={1}
                    onPress={() => { setIcon(option); setIconChanged(true) }}
                  >
                    <Text style={{ fontSize: 24, includeFontPadding: false, lineHeight: 30, textAlign: 'center', textAlignVertical: 'center' }}>{option}</Text>
                  </Button>
                ))}
              </XStack> : null}
            </YStack>

            <FintInput minH={56} placeholder={t('categories.namePlaceholder')} value={name} onChangeText={(value) => { setName(value); if (!iconChanged) setIcon(suggestedCategoryIcons(value, type)[0] ?? icon) }} autoCapitalize="sentences" />
            {errorMessage ? <Paragraph color="$red10">{errorMessage}</Paragraph> : null}

            <FintButton disabled={mutation.isPending} onPress={() => mutation.mutate()} icon={mutation.isPending ? <Spinner color="$background" /> : <Shapes size={18} />}>
              {mutation.isPending ? t('categories.creating') : t('categories.create')}
            </FintButton>
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
      theme={themeMode === 'dark' ? {
        backdrop: 'rgba(0,0,0,0.72)',
        container: '#0B1D2A',
        header: '#F4FBFD',
        knob: '#5DD6E5',
        skinTonesContainer: '#12364A',
        category: { icon: '#8AA9B5', iconActive: '#5DD6E5', container: '#0B1D2A', containerActive: '#12364A' },
        search: { background: '#12364A', text: '#F4FBFD', placeholder: '#8AA9B5', icon: '#8AA9B5' },
        customButton: { icon: '#5DD6E5', iconPressed: '#F4FBFD', background: '#12364A', backgroundPressed: '#0F5D73' },
        emoji: { selected: '#0F5D73' },
      } : undefined}
    />
    </>
  )
}

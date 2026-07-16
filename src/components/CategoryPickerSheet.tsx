import { Plus } from '@tamagui/lucide-icons-2'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Paragraph, Sheet, XStack, YStack } from 'tamagui'
import type { Category, TransactionType } from '../api/types'
import { getCategoryLabel } from '../finance/categoryLabels'
import { suggestedCategoryIcons } from '../finance/categoryIcons'
import { CreateCategorySheet } from './CreateCategorySheet'

interface CategoryPickerSheetProps {
  categories: Category[]
  onValueChange: (value: string) => void
  type: TransactionType
  value: string
}

export function CategoryPickerSheet({ categories, onValueChange, type, value }: CategoryPickerSheetProps) {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const selected = categories.find((category) => category.name === value)

  return (
    <>
      <XStack
        items="center"
        justify="space-between"
        gap="$3"
        bg="$muted"
        borderColor="$input"
        borderWidth={1}
        rounded={14}
        p="$3"
        role="button"
        onPress={() => setOpen(true)}
        aria-label={`${t('forms.category')}: ${selected ? getCategoryLabel(selected.name, t) : t('movements.selectCategory')}`}
      >
        <YStack flex={1} minW={0} gap="$1">
          <Paragraph color="$color10" fontSize="$1">{t('forms.category')}</Paragraph>
          <Paragraph color="$color12" fontWeight="700" numberOfLines={1}>{selected ? `${selected.icon || suggestedCategoryIcons(selected.name, type)[0]} ${getCategoryLabel(selected.name, t)}` : t('movements.selectCategory')}</Paragraph>
        </YStack>
        <Paragraph fontSize="$6">{selected?.icon || '⌄'}</Paragraph>
      </XStack>

      <Sheet modal open={open} onOpenChange={setOpen} snapPoints={[76]} dismissOnSnapToBottom zIndex={110_000}>
        <Sheet.Overlay bg="rgba(4,18,28,0.58)" />
        <Sheet.Handle bg="$color6" />
        <Sheet.Frame bg="$popover" px="$4" pt="$2" pb={Math.max(insets.bottom, 16)} rounded={18}>
          <XStack items="center" justify="space-between" mb="$3">
            <Paragraph color="$color12" fontFamily="$heading" fontSize="$6" fontWeight="700">{t('categories.routeTitle')}</Paragraph>
            <Button chromeless onPress={() => setOpen(false)}>{t('actions.cancel')}</Button>
          </XStack>
          <Sheet.ScrollView showsVerticalScrollIndicator={false}>
            <XStack flexWrap="wrap" gap="$3" pb="$4">
              <CategoryTile icon="+" label={t('categories.newAction')} selected={false} onPress={() => { setOpen(false); setCreateOpen(true) }} />
              {categories.map((category) => (
                <CategoryTile
                  key={category.id}
                  icon={category.icon || suggestedCategoryIcons(category.name, category.type)[0]}
                  label={getCategoryLabel(category.name, t)}
                  selected={category.name === value}
                  onPress={() => { onValueChange(category.name); setOpen(false) }}
                />
              ))}
            </XStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>

      <CreateCategorySheet
        initialType={type}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(category) => onValueChange(category.name)}
      />
    </>
  )
}

function CategoryTile({ icon, label, onPress, selected }: { icon: string; label: string; onPress: () => void; selected: boolean }) {
  return (
    <YStack width="30%" minW={92} items="center" gap="$2" role="button" onPress={onPress} aria-label={label}>
      <YStack width={58} height={58} rounded="$8" bg={selected ? '$secondary' : '$muted'} borderColor={selected ? '$primary' : '$borderColor'} borderWidth={1} items="center" justify="center">
        {icon === '+' ? <Plus size={25} color="$primary" /> : <Paragraph fontSize="$7">{icon}</Paragraph>}
      </YStack>
      <Paragraph color={selected ? '$primary' : '$color10'} fontSize="$1" fontWeight={selected ? '800' : '600'} numberOfLines={1} width="100%" text="center">{label}</Paragraph>
    </YStack>
  )
}

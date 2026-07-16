import { useQuery } from '@tanstack/react-query'
import { Plus, Shapes } from '@tamagui/lucide-icons-2'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Paragraph, XStack, YStack } from 'tamagui'
import { financeApi } from '../src/api/finance'
import type { TransactionType } from '../src/api/types'
import { CreateCategorySheet } from '../src/components/CreateCategorySheet'
import { DataStateCard } from '../src/components/DataStateCard'
import { Screen } from '../src/components/Screen'
import { getCategoryLabel } from '../src/finance/categoryLabels'
import { suggestedCategoryIcons } from '../src/finance/categoryIcons'
import { FintButton, FintCard } from '../src/ui'

export default function CategoriesScreen() {
  const { t } = useTranslation()
  const [type, setType] = useState<TransactionType>('expense')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: () => financeApi.listCategories(), retry: false })
  const categories = (categoriesQuery.data ?? []).filter((category) => category.type === type)

  return (
    <>
      <Screen isRefreshing={categoriesQuery.isRefetching} onRefresh={() => categoriesQuery.refetch()}>
        <XStack items="center" justify="space-between" gap="$3">
          <YStack gap="$1" flex={1}>
            <Paragraph color="$color12" fontFamily="$heading" fontSize="$7" fontWeight="700">{t('categories.title')}</Paragraph>
            <Paragraph color="$color10">{t('categories.subtitle')}</Paragraph>
          </YStack>
          <FintButton size="$3" icon={<Plus size={18} />} onPress={() => setIsCreateOpen(true)}>{t('categories.newAction')}</FintButton>
        </XStack>

        <XStack gap="$2">
          {(['expense', 'income'] as const).map((option) => (
            <FintButton key={option} flex={1} variant={type === option ? 'solid' : 'outlined'} onPress={() => setType(option)}>
              {t(`forms.${option}`)}
            </FintButton>
          ))}
        </XStack>

        {categoriesQuery.isLoading ? <DataStateCard message={t('states.loading')} /> : null}
        {categoriesQuery.error ? (
          <FintCard gap="$3" items="center">
            <Paragraph color="$red10" text="center">{t('categories.loadError')}</Paragraph>
            <FintButton size="$3" variant="outlined" onPress={() => categoriesQuery.refetch()}>{t('actions.retry')}</FintButton>
          </FintCard>
        ) : null}
        {!categoriesQuery.isLoading && !categoriesQuery.error && categories.length === 0 ? (
          <FintCard gap="$3" items="center" py="$6">
            <YStack width={58} height={58} rounded="$10" bg="$secondary" items="center" justify="center">
              <Shapes size={28} color="$primary" />
            </YStack>
            <Paragraph color="$color12" fontFamily="$heading" fontSize="$5" fontWeight="700">{t('categories.emptyTitle')}</Paragraph>
            <Paragraph color="$color10" text="center">{t('categories.emptyDescription')}</Paragraph>
            <FintButton onPress={() => setIsCreateOpen(true)}>{t('categories.newAction')}</FintButton>
          </FintCard>
        ) : null}
        {!categoriesQuery.isLoading && !categoriesQuery.error ? categories.map((category) => (
          <FintCard key={category.id} py="$3">
            <XStack items="center" gap="$3">
              <YStack width={46} height={46} rounded="$10" bg="$secondary" items="center" justify="center">
                <Paragraph fontSize="$6">{category.icon || suggestedCategoryIcons(category.name, category.type)[0]}</Paragraph>
              </YStack>
              <Paragraph color="$color12" fontSize="$4" fontWeight="700" flex={1}>{getCategoryLabel(category.name, t)}</Paragraph>
              <Paragraph color="$color10" fontSize="$2">{t(`forms.${category.type}`)}</Paragraph>
            </XStack>
          </FintCard>
        )) : null}
      </Screen>
      <CreateCategorySheet initialType={type} open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  )
}

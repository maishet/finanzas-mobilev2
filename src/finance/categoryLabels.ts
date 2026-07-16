import type { TFunction } from 'i18next'

export function getCategoryLabel(category: string, t: TFunction) {
  if (category.trim().toLowerCase() === 'debt payment') return t('systemCategories.debtPayment')
  return category
}

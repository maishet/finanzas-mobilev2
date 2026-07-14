import { data as currencyData } from 'currency-codes'
import type { FintSelectOption } from '../ui/FintSheetSelect'

const priority = new Map([
  ['PEN', 0],
  ['USD', 1],
  ['EUR', 2],
])

export const currencyOptions: readonly FintSelectOption[] = currencyData
  .filter((currency) => /^[A-Z]{3}$/.test(currency.code))
  .map((currency) => ({
    value: currency.code,
    label: `${currency.code} · ${currency.currency}`,
  }))
  .sort((left, right) => {
    const leftPriority = priority.get(left.value) ?? 99
    const rightPriority = priority.get(right.value) ?? 99
    return leftPriority - rightPriority || left.value.localeCompare(right.value)
  })

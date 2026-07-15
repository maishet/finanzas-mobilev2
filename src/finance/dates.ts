export function toDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function todayDateString() {
  return toDateString(new Date())
}

export function parseDateString(value?: string | null) {
  if (!value) return null
  const date = new Date(value.includes('T') ? value : `${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateString(value: string, locale: string) {
  const date = parseDateString(value)
  return date ? new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(date) : value
}

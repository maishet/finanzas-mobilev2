export function getRequestErrorMessage(status: number, fallback: string | undefined) {
  if (status === 429) return 'Hay demasiadas solicitudes. Espera un momento e intenta nuevamente.'
  return fallback ?? 'API request failed'
}

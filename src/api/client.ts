import { supabase } from '../auth/supabase'
import type { ApiEnvelope } from './types'

const apiUrl = process.env.EXPO_PUBLIC_API_URL

export async function apiRequest<T>(path: string, options: RequestInit = {}) {
  if (!apiUrl) throw new Error('Missing EXPO_PUBLIC_API_URL')

  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const envelope = (await response.json()) as ApiEnvelope<T>

  if (!response.ok || !envelope.ok) {
    if (response.status === 401) await supabase.auth.signOut()
    throw new Error(envelope.message ?? envelope.error ?? 'API request failed')
  }

  return envelope.data as T
}

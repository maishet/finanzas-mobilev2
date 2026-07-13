import { supabase } from '../auth/supabase'
import type { ApiEnvelope } from './types'

const apiUrl = process.env.EXPO_PUBLIC_API_URL

export class ApiRequestError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.code = code
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}) {
  if (!apiUrl) throw new Error('Missing EXPO_PUBLIC_API_URL')

  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  const url = `${apiUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`

  let response: Response
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch (error) {
    throw new ApiRequestError(error instanceof Error ? error.message : 'Network request failed', 0, 'network_error')
  }

  const envelope = await parseEnvelope<T>(response)

  if (!response.ok || !envelope.ok) {
    if (response.status === 401) await supabase.auth.signOut()
    throw new ApiRequestError(envelope.message ?? envelope.error ?? 'API request failed', response.status, envelope.error)
  }

  if (envelope.data === undefined) {
    throw new ApiRequestError('API response did not include data', response.status, 'missing_data')
  }

  return envelope.data
}

async function parseEnvelope<T>(response: Response): Promise<ApiEnvelope<T>> {
  const text = await response.text()
  if (!text) return { ok: response.ok, data: undefined as T }

  try {
    return JSON.parse(text) as ApiEnvelope<T>
  } catch {
    return {
      ok: false,
      error: 'invalid_json',
      message: response.ok ? 'API returned an invalid JSON response' : `API request failed with status ${response.status}`,
    }
  }
}

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthError, Session } from '@supabase/supabase-js'
import * as QueryParams from 'expo-auth-session/build/QueryParams'
import * as WebBrowser from 'expo-web-browser'
import { supabase } from './supabase'

interface AuthResult {
  error: AuthError | null
}

interface AuthContextValue {
  isLoading: boolean
  session: Session | null
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string) => Promise<AuthResult>
  signInWithGoogle: (redirectTo: string) => Promise<AuthResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setIsLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsLoading(false)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      session,
      async signIn(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return { error }
      },
      async signUp(email, password) {
        const { error } = await supabase.auth.signUp({ email, password })
        return { error }
      },
      async signInWithGoogle(redirectTo) {
        logOAuthDebug('redirectTo', redirectTo)
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo, skipBrowserRedirect: true },
        })
        if (error || !data.url) return { error }
        logOAuthDebug('providerUrl', redactUrl(data.url))

        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)
        if (result.type !== 'success') return { error: null }
        logOAuthDebug('callbackUrl', redactUrl(result.url))

        const params = getOAuthCallbackParams(result.url)
        if (params.access_token && params.refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          })
          return { error: sessionError }
        }

        const code = params.code
        if (!code) return { error: null }

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        return { error: exchangeError }
      },
      async signOut() {
        await supabase.auth.signOut()
      },
    }),
    [isLoading, session]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}

function getOAuthCallbackParams(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url)
  if (errorCode) {
    logOAuthDebug('errorCode', errorCode)
  }

  return {
    code: getStringParam(params.code),
    access_token: getStringParam(params.access_token),
    refresh_token: getStringParam(params.refresh_token),
  }
}

function getStringParam(value: unknown) {
  return typeof value === 'string' ? value : null
}

function logOAuthDebug(label: string, value: string) {
  if (__DEV__) console.log(`[Fint OAuth] ${label}: ${value}`)
}

function redactUrl(url: string) {
  return url
    .replace(/([?#&]code=)[^&#]+/g, '$1<redacted>')
    .replace(/([?#&]access_token=)[^&#]+/g, '$1<redacted>')
    .replace(/([?#&]refresh_token=)[^&#]+/g, '$1<redacted>')
}

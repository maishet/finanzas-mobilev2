import { expect, test } from 'bun:test'
import { getRequestErrorMessage } from '../../src/api/error-message'
import { getInitialRoute } from '../../src/auth/initial-route'

test('returns the login route without a valid session', () => {
  expect(getInitialRoute(false, false)).toBe('/login')
  expect(getInitialRoute(true, true)).toBe('/login')
})

test('returns the dashboard route for an authenticated session', () => {
  expect(getInitialRoute(true, false)).toBe('/(tabs)/dashboard')
})

test('maps rate limits to an actionable error', () => {
  expect(getRequestErrorMessage(429, 'ignored')).toContain('demasiadas solicitudes')
  expect(getRequestErrorMessage(500, 'Servicio no disponible')).toBe('Servicio no disponible')
})

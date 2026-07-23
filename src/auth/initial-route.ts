export function getInitialRoute(hasSession: boolean, isUnauthorized: boolean) {
  return !hasSession || isUnauthorized ? '/login' : '/(tabs)/dashboard'
}

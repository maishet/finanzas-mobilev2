import { useCallback, useEffect, useRef } from 'react'

export function usePressOnce(delayMs = 700) {
  const locked = useRef(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current)
  }, [])

  return useCallback((action: () => void) => {
    if (locked.current) return
    locked.current = true
    action()
    timeout.current = setTimeout(() => { locked.current = false }, delayMs)
  }, [delayMs])
}

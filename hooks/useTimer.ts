import { useEffect, useRef, useState, useCallback } from 'react'

interface UseTimerOptions {
  seconds: number
  onExpire: () => void
  active: boolean
  resetKey?: number // increment this to force a fresh timer
}

export function useTimer({ seconds, onExpire, active, resetKey = 0 }: UseTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const expiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)

  // Keep onExpire ref fresh so we never have stale closure
  useEffect(() => { onExpireRef.current = onExpire }, [onExpire])

  const clear = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }, [])

  const dropToOne = useCallback(() => setTimeLeft(1), [])

  // Restart timer whenever active becomes true OR resetKey changes
  useEffect(() => {
    clear()
    expiredRef.current = false

    if (!active) {
      setTimeLeft(seconds)
      return
    }

    setTimeLeft(seconds)

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clear()
          if (!expiredRef.current) {
            expiredRef.current = true
            onExpireRef.current()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return clear
  }, [active, seconds, resetKey]) // eslint-disable-line

  return { timeLeft, dropToOne }
}

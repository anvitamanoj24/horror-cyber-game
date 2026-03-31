import { useEffect } from 'react'

export function useAntiCheat(onTabSwitch: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return

    const handleBlur = () => {
      onTabSwitch()
    }

    window.addEventListener('blur', handleBlur)
    return () => window.removeEventListener('blur', handleBlur)
  }, [active, onTabSwitch])
}

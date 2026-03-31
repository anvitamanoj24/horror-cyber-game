const LOCK_KEY = 'hcg_locked'
const LOCK_TIME_KEY = 'hcg_locked_at'

export const Permadeath = {
  isLocked(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(LOCK_KEY) === 'true'
  },

  lock() {
    if (typeof window === 'undefined') return
    localStorage.setItem(LOCK_KEY, 'true')
    localStorage.setItem(LOCK_TIME_KEY, Date.now().toString())
  },

  getLockedAt(): number | null {
    if (typeof window === 'undefined') return null
    const val = localStorage.getItem(LOCK_TIME_KEY)
    return val ? parseInt(val) : null
  },

  // Dev-only reset
  unlock() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(LOCK_KEY)
    localStorage.removeItem(LOCK_TIME_KEY)
  },
}

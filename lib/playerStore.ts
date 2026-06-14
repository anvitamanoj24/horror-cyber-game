// Player registration & leaderboard — stored in localStorage
// In a real deployment, this would use a backend/DB

export interface Player {
  username: string
  phone: string
  registeredAt: number
  completedLevels: number[]   // [1, 2, 3, 4]
  score: number
  completedAt: number | null
}

export interface AdminUnlock {
  levelId: number
  unlockedAt: number
  unlockedBy: string // admin name
}

const PLAYERS_KEY = 'chipsync_players'
const CURRENT_PLAYER_KEY = 'chipsync_current_player'
const UNLOCKS_KEY = 'chipsync_unlocks'
const ADMIN_PASSWORD = 'CHIPSYNC@ADMIN2025'

// ── Player CRUD ──────────────────────────────────────────

export function getAllPlayers(): Player[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(PLAYERS_KEY) || '[]')
  } catch { return [] }
}

export function savePlayer(player: Player) {
  const players = getAllPlayers()
  const idx = players.findIndex(p => p.phone === player.phone)
  if (idx >= 0) players[idx] = player
  else players.push(player)
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
}

export function getCurrentPlayer(): Player | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CURRENT_PLAYER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function setCurrentPlayer(player: Player) {
  localStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(player))
  savePlayer(player)
}

export function clearCurrentPlayer() {
  localStorage.removeItem(CURRENT_PLAYER_KEY)
}

export function updatePlayerScore(phone: string, completedLevel: number, pointsEarned: number) {
  const players = getAllPlayers()
  const player = players.find(p => p.phone === phone)
  if (!player) return
  if (!player.completedLevels.includes(completedLevel)) {
    player.completedLevels.push(completedLevel)
  }
  player.score += pointsEarned
  if (player.completedLevels.length === 4) {
    player.completedAt = Date.now()
  }
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
  // Update current player too
  const current = getCurrentPlayer()
  if (current?.phone === phone) setCurrentPlayer(player)
}

// ── Admin Unlocks ─────────────────────────────────────────

export function getUnlockedLevels(): number[] {
  if (typeof window === 'undefined') return [1]
  try {
    const raw = localStorage.getItem(UNLOCKS_KEY)
    const unlocks: AdminUnlock[] = raw ? JSON.parse(raw) : []
    return [1, ...unlocks.map(u => u.levelId)]
  } catch { return [1] }
}

export function adminUnlockLevel(levelId: number, adminName: string) {
  const raw = localStorage.getItem(UNLOCKS_KEY)
  const unlocks: AdminUnlock[] = raw ? JSON.parse(raw) : []
  if (!unlocks.find(u => u.levelId === levelId)) {
    unlocks.push({ levelId, unlockedAt: Date.now(), unlockedBy: adminName })
    localStorage.setItem(UNLOCKS_KEY, JSON.stringify(unlocks))
  }
}

export function adminLockLevel(levelId: number) {
  const raw = localStorage.getItem(UNLOCKS_KEY)
  const unlocks: AdminUnlock[] = raw ? JSON.parse(raw) : []
  localStorage.setItem(UNLOCKS_KEY, JSON.stringify(unlocks.filter(u => u.levelId !== levelId)))
}

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

// ── Leaderboard ───────────────────────────────────────────

export function getLeaderboard(): Player[] {
  return getAllPlayers()
    .sort((a, b) => {
      // Sort by score desc, then by completedAt asc (faster wins)
      if (b.score !== a.score) return b.score - a.score
      if (a.completedAt && b.completedAt) return a.completedAt - b.completedAt
      if (a.completedAt) return -1
      if (b.completedAt) return 1
      return b.completedLevels.length - a.completedLevels.length
    })
}

export function scoreForLevel(levelId: number): number {
  return levelId * 100  // Level 1 = 100pts, Level 2 = 200pts, etc.
}

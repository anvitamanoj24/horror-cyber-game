import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { updatePlayerScore, scoreForLevel } from '@/lib/playerStore'

export type GamePhase = 'register' | 'intro' | 'levelSelect' | 'levelBrief' | 'playing' | 'melt' | 'locked' | 'portal'

interface GameState {
  phase: GamePhase
  currentLevel: number
  currentEpisode: number
  completedEpisodes: number
  fragments: string[]
  lockedAt: number | null
  masterRiddleActive: boolean
  portalIdea: string
  playerPhone: string | null

  register: (phone: string) => void
  startGame: () => void
  selectLevel: (level: number) => void
  enterLevel: () => void
  advanceEpisode: () => void
  solveMasterRiddle: () => void
  triggerMelt: () => void
  collectFragment: (fragment: string) => void
  setPortalIdea: (idea: string) => void
  resetGame: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      phase: 'register',
      currentLevel: 1,
      currentEpisode: 1,
      completedEpisodes: 0,
      fragments: [],
      lockedAt: null,
      masterRiddleActive: false,
      portalIdea: '',
      playerPhone: null,

      register: (phone: string) => {
        set({ playerPhone: phone, phase: 'intro' })
      },

      startGame: () => {
        set({ phase: 'levelSelect' })
      },

      selectLevel: (level: number) => {
        set({ currentLevel: level, currentEpisode: 1, phase: 'levelBrief' })
      },

      enterLevel: () => {
        set({ phase: 'playing' })
      },

      advanceEpisode: () => {
        const { currentEpisode, completedEpisodes } = get()
        const newCompleted = completedEpisodes + 1
        if (currentEpisode === 10) {
          set({ masterRiddleActive: true, completedEpisodes: newCompleted })
        } else {
          set({ currentEpisode: currentEpisode + 1, completedEpisodes: newCompleted })
        }
      },

      solveMasterRiddle: () => {
        const { currentLevel, playerPhone } = get()
        // Award points for completing the level
        if (playerPhone) {
          updatePlayerScore(playerPhone, currentLevel, scoreForLevel(currentLevel))
        }
        if (currentLevel === 4) {
          set({ phase: 'portal', masterRiddleActive: false })
        } else {
          set({ masterRiddleActive: false, phase: 'levelSelect' })
        }
      },

      triggerMelt: () => {
        // Testing mode — go back to level select
        set({ phase: 'levelSelect' })
      },

      collectFragment: (fragment: string) => {
        const { fragments } = get()
        if (!fragments.includes(fragment)) set({ fragments: [...fragments, fragment] })
      },

      setPortalIdea: (idea: string) => set({ portalIdea: idea }),

      resetGame: () => set({
        phase: 'register',
        currentLevel: 1,
        currentEpisode: 1,
        completedEpisodes: 0,
        fragments: [],
        lockedAt: null,
        masterRiddleActive: false,
        portalIdea: '',
        playerPhone: null,
      }),
    }),
    { name: 'chipsync-game-state' }
  )
)

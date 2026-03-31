import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type GamePhase = 'intro' | 'levelSelect' | 'levelBrief' | 'playing' | 'melt' | 'locked' | 'portal'

interface GameState {
  phase: GamePhase
  currentLevel: number
  currentEpisode: number
  completedEpisodes: number
  fragments: string[]
  lockedAt: number | null
  masterRiddleActive: boolean
  portalIdea: string

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
      phase: 'intro',
      currentLevel: 1,
      currentEpisode: 1,
      completedEpisodes: 0,
      fragments: [],
      lockedAt: null,
      masterRiddleActive: false,
      portalIdea: '',

      startGame: () => {
        const { lockedAt } = get()
        if (lockedAt) return
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
        const { currentLevel } = get()
        if (currentLevel === 4) {
          set({ phase: 'portal', masterRiddleActive: false })
        } else {
          // Go back to level select for next level
          set({ masterRiddleActive: false, phase: 'levelSelect' })
        }
      },

      triggerMelt: () => {
        // TESTING MODE — skip permadeath, just go back to level select
        set({ phase: 'levelSelect' })
      },

      collectFragment: (fragment: string) => {
        const { fragments } = get()
        if (!fragments.includes(fragment)) set({ fragments: [...fragments, fragment] })
      },

      setPortalIdea: (idea: string) => set({ portalIdea: idea }),

      resetGame: () => set({
        phase: 'intro',
        currentLevel: 1,
        currentEpisode: 1,
        completedEpisodes: 0,
        fragments: [],
        lockedAt: null,
        masterRiddleActive: false,
        portalIdea: '',
      }),
    }),
    { name: 'horror-cyber-game-state' }
  )
)

'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface LightContextType {
  lightOn: boolean
  episodeId: number
  torchRadius: number
  setEpisodeId: (id: number) => void
  turnOnLight: () => void
  resetLight: () => void
  setTorchRadius: (r: number) => void
}

const LightContext = createContext<LightContextType>({
  lightOn: false,
  episodeId: 1,
  torchRadius: 160,
  setEpisodeId: () => {},
  turnOnLight: () => {},
  resetLight: () => {},
  setTorchRadius: () => {},
})

export function LightProvider({ children }: { children: ReactNode }) {
  const [lightOn, setLightOn] = useState(false)
  const [episodeId, setEpisodeIdState] = useState(1)
  const [torchRadius, setTorchRadius] = useState(160)

  const setEpisodeId = useCallback((id: number) => {
    setEpisodeIdState(id)
    setLightOn(false) // always dark on new episode/page
  }, [])

  const turnOnLight = useCallback(() => setLightOn(true), [])
  const resetLight = useCallback(() => setLightOn(false), [])

  return (
    <LightContext.Provider value={{
      lightOn, episodeId, torchRadius,
      setEpisodeId, turnOnLight, resetLight, setTorchRadius,
    }}>
      {children}
    </LightContext.Provider>
  )
}

export const useLightContext = () => useContext(LightContext)

// 20 unique positions spread across all screen edges/corners
const POSITIONS = [
  { x: 92, y: 8  },
  { x: 8,  y: 8  },
  { x: 8,  y: 88 },
  { x: 92, y: 88 },
  { x: 50, y: 5  },
  { x: 15, y: 50 },
  { x: 85, y: 50 },
  { x: 50, y: 92 },
  { x: 78, y: 12 },
  { x: 22, y: 12 },
  { x: 22, y: 82 },
  { x: 78, y: 82 },
  { x: 65, y: 6  },
  { x: 35, y: 6  },
  { x: 6,  y: 65 },
  { x: 94, y: 35 },
  { x: 88, y: 72 },
  { x: 12, y: 28 },
  { x: 55, y: 94 },
  { x: 45, y: 94 },
]

export function getBulbPosition(episodeId: number) {
  return POSITIONS[(episodeId - 1) % POSITIONS.length]
}

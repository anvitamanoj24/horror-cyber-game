'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LEVELS } from '@/data/episodes'
import { useLightContext } from '@/lib/lightContext'
import { getUnlockedLevels } from '@/lib/playerStore'

interface LevelSelectProps {
  fragments: string[]
  completedEpisodes: number
  onSelect: (levelId: number) => void
}

const DOOR_NAMES = ['CHIPSYNC', 'LOCKED', 'LOCKED', 'LOCKED']
const DOOR_EMOJIS = ['🚪', '🔒', '🔒', '🔒']

export default function LevelSelect({ fragments, completedEpisodes, onSelect }: LevelSelectProps) {
  const { setEpisodeId } = useLightContext()
  const [adminUnlocked, setAdminUnlocked] = useState<number[]>([1])

  useEffect(() => {
    setEpisodeId(98)
    setAdminUnlocked(getUnlockedLevels())
  }, [setEpisodeId])

  // A level is playable if:
  // 1. Admin has unlocked it, AND
  // 2. Player has completed the previous level (or it's level 1)
  const isPlayable = (levelId: number) => {
    if (!adminUnlocked.includes(levelId)) return false
    if (levelId === 1) return true
    return fragments.includes(LEVELS[levelId - 2].fragment)
  }

  const isAdminLocked = (levelId: number) => !adminUnlocked.includes(levelId)
  const isPlayerLocked = (levelId: number) => adminUnlocked.includes(levelId) && !isPlayable(levelId)
  const isCompleted = (levelId: number) => fragments.includes(LEVELS[levelId - 1].fragment)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#020205' }}>

      {/* Hallway SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.07 }} preserveAspectRatio="none">
        <line x1="50%" y1="0" x2="5%"  y2="100%" stroke="#3a2a1a" strokeWidth="1"/>
        <line x1="50%" y1="0" x2="95%" y2="100%" stroke="#3a2a1a" strokeWidth="1"/>
        <line x1="50%" y1="0" x2="20%" y2="100%" stroke="#3a2a1a" strokeWidth="0.5"/>
        <line x1="50%" y1="0" x2="80%" y2="100%" stroke="#3a2a1a" strokeWidth="0.5"/>
        {[20, 40, 60, 80].map(y => (
          <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#3a2a1a" strokeWidth="0.4"/>
        ))}
      </svg>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="text-center mb-10 relative z-10">
        <div style={{ fontFamily: "'Special Elite', serif", fontSize: '1.8rem', color: '#f5c842',
          textShadow: '0 0 20px rgba(245,200,66,0.3)', letterSpacing: '0.15em' }}>
          — THE HAUNTED HALLWAY —
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.65rem',
          marginTop: '0.5rem', letterSpacing: '0.2em' }}>
          {completedEpisodes}/40 ROOMS CLEARED
        </div>
      </motion.div>

      {/* Four doors */}
      <div className="grid grid-cols-2 gap-5 w-full max-w-3xl px-8 relative z-10">
        {LEVELS.map((level, i) => {
          const playable = isPlayable(level.id)
          const adminLocked = isAdminLocked(level.id)
          const completed = isCompleted(level.id)

          return (
            <motion.div key={level.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.6 }}>
              <button
                onClick={() => playable && onSelect(level.id)}
                disabled={!playable}
                className="w-full text-left door-frame relative overflow-hidden group"
                style={{
                  background: completed
                    ? `linear-gradient(135deg, ${level.color}22, #0a0806)`
                    : playable
                    ? `linear-gradient(135deg, ${level.color}11, #0a0806)`
                    : '#0a0806',
                  borderColor: completed ? level.color + '88' : playable ? level.color + '44' : '#1a1208',
                  opacity: playable ? 1 : adminLocked ? 0.3 : 0.5,
                  transition: 'all 0.3s', padding: 0,
                }}
              >
                {/* Top accent bar */}
                <div className="w-full h-1" style={{
                  background: completed ? level.color
                    : playable ? `linear-gradient(to right, transparent, ${level.color}66, transparent)`
                    : 'transparent',
                  boxShadow: completed ? `0 0 8px ${level.color}` : 'none',
                }} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '1.8rem',
                        filter: playable ? `drop-shadow(0 0 8px ${level.color}88)` : 'grayscale(1) opacity(0.3)' }}>
                        {adminLocked ? '🔒' : DOOR_EMOJIS[i]}
                      </span>
                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.5rem', letterSpacing: '0.2em' }}>
                          LEVEL {level.id}
                        </div>
                        {/* Door name — CHIPSYNC for level 1 */}
                        <div style={{ fontFamily: "'Special Elite', serif",
                          color: playable ? level.color : '#3a2a1a',
                          fontSize: '1rem', letterSpacing: '0.05em' }}>
                          {DOOR_NAMES[i]}
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.5rem' }}>
                          {level.room}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem',
                      color: completed ? level.color : playable ? '#8b6a4a' : '#3a2a1a',
                      letterSpacing: '0.1em', textAlign: 'right' }}>
                      {completed ? '✓ CLEARED'
                        : adminLocked ? '🔒 ADMIN\nLOCKED'
                        : playable ? '▶ ENTER'
                        : '🔒 LOCKED'}
                    </div>
                  </div>

                  {/* Theme */}
                  <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.55rem', lineHeight: 1.5 }}>
                    {level.theme}
                  </div>

                  {/* Progress dots */}
                  {playable && (
                    <div className="flex gap-1 mt-3">
                      {Array.from({ length: 10 }).map((_, j) => {
                        const isDone = completed
                        return (
                          <div key={j} style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: isDone ? level.color : '#1a1208',
                            boxShadow: isDone ? `0 0 3px ${level.color}` : 'none',
                          }} />
                        )
                      })}
                    </div>
                  )}

                  {/* Admin locked notice */}
                  {adminLocked && (
                    <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.55rem',
                      marginTop: '0.5rem', fontStyle: 'italic' }}>
                      Awaiting admin unlock
                    </div>
                  )}

                  {/* Fragment */}
                  {completed && (
                    <div style={{ fontFamily: 'JetBrains Mono', color: level.color + '88', fontSize: '0.55rem',
                      borderTop: `1px solid ${level.color}22`, paddingTop: '0.4rem', marginTop: '0.5rem' }}>
                      ◈ {level.fragment}
                    </div>
                  )}
                </div>

                {playable && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${level.color}08, transparent 70%)`, transition: 'opacity 0.3s' }} />
                )}
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Blood drips */}
      {[12, 30, 50, 70, 88].map((left, i) => (
        <div key={i} className="absolute top-0 pointer-events-none" style={{
          left: `${left}%`, width: '2px', height: `${10 + i * 8}%`,
          background: 'linear-gradient(to bottom, #8b0000, transparent)', opacity: 0.25 }} />
      ))}
    </div>
  )
}

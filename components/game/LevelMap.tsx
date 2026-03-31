'use client'
import { motion } from 'framer-motion'
import { LEVELS } from '@/data/episodes'

interface LevelMapProps {
  currentLevel: number
  currentEpisode: number
  fragments: string[]
}

const DOOR_ICONS = ['🚪', '📚', '🔬', '🏚️']

export default function LevelMap({ currentLevel, currentEpisode, fragments }: LevelMapProps) {
  return (
    <div className="w-full space-y-1">
      {/* Hallway label */}
      <div
        className="text-center text-xs mb-4 tracking-widest"
        style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', letterSpacing: '0.2em' }}
      >
        — THE HALLWAY —
      </div>

      {LEVELS.map((level) => {
        const isCompleted = fragments.includes(level.fragment)
        const isActive = level.id === currentLevel
        const isLocked = level.id > currentLevel

        return (
          <div key={level.id} className="relative">
            {/* Blood wire connecting to next */}
            {level.id < 4 && isCompleted && (
              <div
                className="absolute left-1/2 -translate-x-1/2 w-px"
                style={{
                  bottom: '-8px',
                  height: '8px',
                  background: 'linear-gradient(to bottom, #8b0000, #8b000066)',
                  boxShadow: '0 0 4px #ff0000',
                  zIndex: 1,
                }}
              />
            )}

            {/* Door card */}
            <motion.div
              animate={isActive ? {
                boxShadow: [
                  `0 0 10px ${level.color}44`,
                  `0 0 25px ${level.color}88`,
                  `0 0 10px ${level.color}44`,
                ],
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="door-frame p-3 relative overflow-hidden"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${level.color}22, #0a0806)`
                  : isCompleted
                  ? 'linear-gradient(135deg, #1a0a0a, #0a0806)'
                  : '#0a0806',
                borderColor: isActive ? level.color : isCompleted ? '#3a1a1a' : '#1a1208',
                opacity: isLocked ? 0.4 : 1,
              }}
            >
              {/* Room number */}
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: '1rem' }}>{DOOR_ICONS[level.id - 1]}</span>
                <div>
                  <div
                    className="text-xs font-bold tracking-wider"
                    style={{
                      fontFamily: "'Special Elite', serif",
                      color: isActive ? level.color : isCompleted ? '#8b4a4a' : '#3a2a1a',
                      fontSize: '0.65rem',
                    }}
                  >
                    {isCompleted ? '✓ ' : isActive ? '▶ ' : isLocked ? '🔒 ' : '○ '}
                    {level.title}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: '#3a2a1a', fontFamily: 'JetBrains Mono', fontSize: '0.55rem' }}
                  >
                    {level.room}
                  </div>
                </div>
              </div>

              {/* Episode progress bar */}
              {isActive && (
                <div className="mt-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-sm"
                        style={{
                          background: i < currentEpisode - 1
                            ? level.color
                            : i === currentEpisode - 1
                            ? `${level.color}88`
                            : '#1a1208',
                          boxShadow: i < currentEpisode - 1 ? `0 0 3px ${level.color}` : 'none',
                        }}
                      />
                    ))}
                  </div>
                  <div
                    className="text-right mt-1"
                    style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', color: level.color + '88' }}
                  >
                    room {currentEpisode}/10
                  </div>
                </div>
              )}

              {/* Completed fragment */}
              {isCompleted && (
                <div
                  className="mt-1 text-xs"
                  style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', color: '#8b4a4a' }}
                >
                  ◈ fragment collected
                </div>
              )}
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

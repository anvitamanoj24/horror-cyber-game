'use client'
import { motion } from 'framer-motion'
import { LEVELS } from '@/data/episodes'

interface LevelSelectProps {
  fragments: string[]
  completedEpisodes: number
  onSelect: (levelId: number) => void
}

const DOOR_EMOJIS = ['🚪', '📚', '🔬', '🏚️']
const LOCK_POSITIONS = ['top-right', 'top-left', 'bottom-left', 'bottom-right']

export default function LevelSelect({ fragments, completedEpisodes, onSelect }: LevelSelectProps) {
  // A level is available if it's level 1, or the previous level's fragment is collected
  const isAvailable = (levelId: number) => {
    if (levelId === 1) return true
    return fragments.includes(LEVELS[levelId - 2].fragment)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#020205' }}
    >
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative z-10"
      >
        <div
          style={{
            fontFamily: "'Special Elite', serif",
            fontSize: '2rem',
            color: '#f5c842',
            textShadow: '0 0 20px rgba(245,200,66,0.3)',
            letterSpacing: '0.15em',
          }}
        >
          — CHOOSE YOUR ROOM —
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.65rem', marginTop: '0.5rem', letterSpacing: '0.2em' }}>
          {completedEpisodes}/40 ROOMS CLEARED
        </div>
      </motion.div>

      {/* Four doors */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-3xl px-8 relative z-10">
        {LEVELS.map((level, i) => {
          const available = isAvailable(level.id)
          const completed = fragments.includes(level.fragment)

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <button
                onClick={() => available && onSelect(level.id)}
                disabled={!available}
                className="w-full text-left door-frame relative overflow-hidden group"
                style={{
                  background: completed
                    ? `linear-gradient(135deg, ${level.color}22, #0a0806)`
                    : available
                    ? `linear-gradient(135deg, ${level.color}11, #0a0806)`
                    : '#0a0806',
                  borderColor: completed ? level.color + '88' : available ? level.color + '44' : '#1a1208',
                  opacity: available ? 1 : 0.4,
                  transition: 'all 0.3s',
                  padding: 0,
                }}
              >
                {/* Door top accent */}
                <div
                  className="w-full h-1"
                  style={{
                    background: completed
                      ? level.color
                      : available
                      ? `linear-gradient(to right, transparent, ${level.color}66, transparent)`
                      : 'transparent',
                    boxShadow: completed ? `0 0 8px ${level.color}` : 'none',
                  }}
                />

                <div className="p-5">
                  {/* Door emoji + level number */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          fontSize: '2rem',
                          filter: available
                            ? `drop-shadow(0 0 8px ${level.color}88)`
                            : 'grayscale(1) opacity(0.3)',
                        }}
                      >
                        {DOOR_EMOJIS[i]}
                      </span>
                      <div>
                        <div
                          style={{
                            fontFamily: 'JetBrains Mono',
                            color: '#3a2a1a',
                            fontSize: '0.55rem',
                            letterSpacing: '0.2em',
                          }}
                        >
                          LEVEL {level.id}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Special Elite', serif",
                            color: available ? level.color : '#3a2a1a',
                            fontSize: '1rem',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {level.title}
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div
                      style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.6rem',
                        color: completed ? level.color : available ? '#8b6a4a' : '#3a2a1a',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {completed ? '✓ CLEARED' : available ? '▶ ENTER' : '🔒 LOCKED'}
                    </div>
                  </div>

                  {/* Room subtitle */}
                  <div
                    style={{
                      fontFamily: "'Special Elite', serif",
                      color: '#8b6a4a',
                      fontSize: '0.75rem',
                      fontStyle: 'italic',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {level.room}
                  </div>

                  {/* Theme */}
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono',
                      color: '#3a2a1a',
                      fontSize: '0.58rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {level.theme}
                  </div>

                  {/* Episode progress dots */}
                  {available && (
                    <div className="flex gap-1 mt-3">
                      {Array.from({ length: 10 }).map((_, j) => {
                        const epNum = level.id === 1 ? j : j
                        const globalEp = (level.id - 1) * 10 + j
                        const isDone = completed || (level.id === 1 && j < (completedEpisodes % 10 || (completed ? 10 : 0)))
                        return (
                          <div
                            key={j}
                            style={{
                              width: 6, height: 6,
                              borderRadius: '50%',
                              background: isDone ? level.color : '#1a1208',
                              boxShadow: isDone ? `0 0 4px ${level.color}` : 'none',
                            }}
                          />
                        )
                      })}
                    </div>
                  )}

                  {/* Fragment collected */}
                  {completed && (
                    <div
                      className="mt-3 text-xs"
                      style={{
                        fontFamily: 'JetBrains Mono',
                        color: level.color + '88',
                        fontSize: '0.6rem',
                        borderTop: `1px solid ${level.color}22`,
                        paddingTop: '0.5rem',
                      }}
                    >
                      ◈ {level.fragment}
                    </div>
                  )}
                </div>

                {/* Hover glow */}
                {available && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${level.color}08, transparent 70%)`,
                      transition: 'opacity 0.3s',
                    }}
                  />
                )}
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Blood drips */}
      {[12, 30, 50, 70, 88].map((left, i) => (
        <div key={i} className="absolute top-0 pointer-events-none" style={{
          left: `${left}%`, width: '2px',
          height: `${10 + i * 8}%`,
          background: 'linear-gradient(to bottom, #8b0000, transparent)',
          opacity: 0.25,
        }}/>
      ))}
    </div>
  )
}

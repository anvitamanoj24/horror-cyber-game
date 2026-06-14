'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getLeaderboard } from '@/lib/playerStore'
import type { Player } from '@/lib/playerStore'

interface LeaderboardProps {
  onClose: () => void
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    setPlayers(getLeaderboard())
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 10000, background: 'rgba(2,2,5,0.95)' }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg mx-4 door-frame"
        style={{ background: '#0a0806', borderColor: '#f5c84244', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0" style={{ borderColor: '#3a2a1a' }}>
          <div style={{ fontFamily: "'Special Elite', serif", color: '#f5c842', fontSize: '1rem', letterSpacing: '0.1em' }}>
            🏆 LEADERBOARD
          </div>
          <button onClick={onClose} className="haunted-btn px-3 py-1 text-xs" style={{ borderColor: '#3a2a1a', color: '#3a2a1a' }}>
            ✕ CLOSE
          </button>
        </div>

        {/* Column headers */}
        <div className="px-5 py-2 border-b flex-shrink-0" style={{ borderColor: '#1a1208' }}>
          <div className="grid" style={{ gridTemplateColumns: '2rem 1fr 4rem 4rem', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.55rem', letterSpacing: '0.15em' }}>#</div>
            <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.55rem', letterSpacing: '0.15em' }}>PLAYER</div>
            <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.55rem', letterSpacing: '0.15em', textAlign: 'center' }}>LEVELS</div>
            <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.55rem', letterSpacing: '0.15em', textAlign: 'right' }}>SCORE</div>
          </div>
        </div>

        {/* Players list */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {players.length === 0 ? (
            <div className="p-8 text-center" style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.75rem' }}>
              No players yet. Be the first to register.
            </div>
          ) : (
            players.map((player, i) => (
              <motion.div
                key={player.phone}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-5 py-3 border-b"
                style={{
                  borderColor: '#1a1208',
                  background: i === 0 ? 'rgba(245,200,66,0.04)' : 'transparent',
                }}
              >
                <div className="grid items-center" style={{ gridTemplateColumns: '2rem 1fr 4rem 4rem', gap: '0.5rem' }}>
                  {/* Rank */}
                  <div style={{ fontFamily: 'JetBrains Mono', color: '#f5c842', fontSize: '0.85rem' }}>
                    {i < 3 ? MEDALS[i] : `${i + 1}.`}
                  </div>

                  {/* Name + phone */}
                  <div>
                    <div style={{ fontFamily: "'Special Elite', serif", color: i === 0 ? '#f5c842' : '#c8d8e8', fontSize: '0.85rem' }}>
                      {player.username}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.55rem' }}>
                      {player.phone.slice(0, 4)}•••{player.phone.slice(-3)}
                    </div>
                  </div>

                  {/* Levels */}
                  <div className="flex gap-0.5 justify-center">
                    {[1, 2, 3, 4].map(l => (
                      <div key={l} style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: player.completedLevels.includes(l) ? '#f5c842' : '#1a1208',
                        boxShadow: player.completedLevels.includes(l) ? '0 0 4px #f5c842' : 'none',
                      }} />
                    ))}
                  </div>

                  {/* Score */}
                  <div style={{ fontFamily: 'JetBrains Mono', color: '#f5c842', fontSize: '0.8rem', textAlign: 'right', fontWeight: 'bold' }}>
                    {player.score}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2 border-t flex-shrink-0" style={{ borderColor: '#1a1208', fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.55rem' }}>
          {players.length} registered · scores update after each level
        </div>
      </motion.div>
    </motion.div>
  )
}

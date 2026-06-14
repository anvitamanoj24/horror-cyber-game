'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { verifyAdminPassword, adminUnlockLevel, adminLockLevel, getUnlockedLevels, getAllPlayers } from '@/lib/playerStore'
import { LEVELS } from '@/data/episodes'

interface AdminPanelProps {
  onClose: () => void
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1])
  const [adminName, setAdminName] = useState('Admin')

  useEffect(() => {
    if (authed) setUnlockedLevels(getUnlockedLevels())
  }, [authed])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (verifyAdminPassword(password)) {
      setAuthed(true)
      setError('')
    } else {
      setError('Wrong password')
    }
  }

  const toggleLevel = (levelId: number) => {
    if (levelId === 1) return // Level 1 always unlocked
    const isUnlocked = unlockedLevels.includes(levelId)
    if (isUnlocked) {
      adminLockLevel(levelId)
    } else {
      adminUnlockLevel(levelId, adminName)
    }
    setUnlockedLevels(getUnlockedLevels())
  }

  const players = getAllPlayers()

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
        style={{ background: '#0a0806', borderColor: '#f5c84244', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: '#3a2a1a' }}>
          <div style={{ fontFamily: "'Special Elite', serif", color: '#f5c842', fontSize: '1rem', letterSpacing: '0.1em' }}>
            ⚙ ADMIN PANEL
          </div>
          <button onClick={onClose} className="haunted-btn px-3 py-1 text-xs" style={{ borderColor: '#3a2a1a', color: '#3a2a1a' }}>
            ✕ CLOSE
          </button>
        </div>

        {!authed ? (
          <div className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div style={{ fontFamily: 'JetBrains Mono', color: '#8b6a4a', fontSize: '0.75rem' }}>
                Enter admin password to continue
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="admin password..."
                autoComplete="off"
                style={{
                  width: '100%', background: 'transparent', border: 'none',
                  borderBottom: '1px solid #f5c84244', color: '#f5c842',
                  fontFamily: 'JetBrains Mono', fontSize: '0.9rem', outline: 'none',
                  padding: '0.5rem 0', caretColor: '#f5c842', pointerEvents: 'auto',
                }}
              />
              {error && <div style={{ color: '#ff0033', fontFamily: 'JetBrains Mono', fontSize: '0.65rem' }}>{error}</div>}
              <button type="submit" className="haunted-btn w-full py-2 text-sm tracking-widest"
                style={{ borderColor: '#f5c84266', color: '#f5c842' }}>
                [ LOGIN ]
              </button>
            </form>
          </div>
        ) : (
          <div className="p-5 space-y-6">
            {/* Admin name */}
            <div>
              <label style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.55rem', letterSpacing: '0.2em', display: 'block', marginBottom: '0.3rem' }}>
                ADMIN NAME (for logs)
              </label>
              <input
                type="text"
                value={adminName}
                onChange={e => setAdminName(e.target.value)}
                style={{
                  background: 'transparent', border: 'none', borderBottom: '1px solid #3a2a1a',
                  color: '#c8d8e8', fontFamily: 'JetBrains Mono', fontSize: '0.8rem',
                  outline: 'none', padding: '0.25rem 0', caretColor: '#f5c842', pointerEvents: 'auto',
                }}
              />
            </div>

            {/* Level unlock toggles */}
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', color: '#f5c842', fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
                LEVEL ACCESS CONTROL
              </div>
              <div className="space-y-2">
                {LEVELS.map(level => {
                  const isUnlocked = unlockedLevels.includes(level.id)
                  const isAlwaysOn = level.id === 1
                  return (
                    <div key={level.id} className="flex items-center justify-between p-3"
                      style={{ border: `1px solid ${isUnlocked ? level.color + '44' : '#1a1208'}`,
                        background: isUnlocked ? `${level.color}08` : 'transparent' }}>
                      <div>
                        <div style={{ fontFamily: "'Special Elite', serif", color: isUnlocked ? level.color : '#3a2a1a', fontSize: '0.85rem' }}>
                          {level.title}
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.55rem' }}>
                          {level.theme}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleLevel(level.id)}
                        disabled={isAlwaysOn}
                        className="haunted-btn px-4 py-1 text-xs"
                        style={{
                          borderColor: isUnlocked ? level.color + '66' : '#3a2a1a',
                          color: isUnlocked ? level.color : '#3a2a1a',
                          opacity: isAlwaysOn ? 0.4 : 1,
                        }}
                      >
                        {isAlwaysOn ? 'ALWAYS ON' : isUnlocked ? '🔓 LOCK' : '🔒 UNLOCK'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Player count */}
            <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.65rem', borderTop: '1px solid #1a1208', paddingTop: '0.75rem' }}>
              {players.length} player{players.length !== 1 ? 's' : ''} registered
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

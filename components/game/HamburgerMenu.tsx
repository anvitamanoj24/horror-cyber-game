'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Leaderboard from '@/components/game/Leaderboard'
import AdminPanel from '@/components/game/AdminPanel'
import { getCurrentPlayer } from '@/lib/playerStore'

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const player = getCurrentPlayer()

  return (
    <>
      {/* Hamburger button — always visible top-right */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9997 }}>
        <button
          onClick={() => setOpen(o => !o)}
          className="haunted-btn"
          style={{
            padding: '8px 12px',
            borderColor: 'rgba(245,200,66,0.3)',
            color: 'rgba(245,200,66,0.8)',
            fontFamily: 'JetBrains Mono',
            fontSize: '1.1rem',
            lineHeight: 1,
            pointerEvents: 'auto',
          }}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed', top: 56, right: 16, zIndex: 9997,
              background: 'rgba(10,8,6,0.97)',
              border: '1px solid rgba(245,200,66,0.2)',
              borderRadius: 4,
              minWidth: 180,
              overflow: 'hidden',
            }}
          >
            {/* Player info */}
            {player && (
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #1a1208' }}>
                <div style={{ fontFamily: "'Special Elite', serif", color: '#f5c842', fontSize: '0.85rem' }}>
                  {player.username}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.55rem', marginTop: 2 }}>
                  Score: {player.score} pts · {player.completedLevels.length}/4 levels
                </div>
              </div>
            )}

            {/* Leaderboard */}
            <button
              onClick={() => { setShowLeaderboard(true); setOpen(false) }}
              className="haunted-btn w-full text-left"
              style={{ padding: '10px 14px', border: 'none', borderBottom: '1px solid #1a1208',
                borderRadius: 0, color: '#c8d8e8', fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}
            >
              🏆 &nbsp; Leaderboard
            </button>

            {/* Admin panel */}
            <button
              onClick={() => { setShowAdmin(true); setOpen(false) }}
              className="haunted-btn w-full text-left"
              style={{ padding: '10px 14px', border: 'none',
                borderRadius: 0, color: '#8b6a4a', fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}
            >
              ⚙ &nbsp; Admin Panel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard modal */}
      <AnimatePresence>
        {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      </AnimatePresence>

      {/* Admin panel modal */}
      <AnimatePresence>
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      </AnimatePresence>
    </>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { setCurrentPlayer, getAllPlayers } from '@/lib/playerStore'
import { AudioEngine } from '@/lib/audioEngine'
import type { Player } from '@/lib/playerStore'

interface RegistrationScreenProps {
  onComplete: () => void
}

export default function RegistrationScreen({ onComplete }: RegistrationScreenProps) {
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Play entry page music on mount, stop when leaving
  useEffect(() => {
    AudioEngine.playEntryPage()
    return () => AudioEngine.stopEntryPage()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (username.trim().length < 2) { setError('Username must be at least 2 characters'); return }
    if (!/^\d{10}$/.test(phone.trim())) { setError('Enter a valid 10-digit phone number'); return }

    setSubmitting(true)

    // Check if phone already registered
    const existing = getAllPlayers().find(p => p.phone === phone.trim())
    if (existing) {
      setCurrentPlayer(existing)
      AudioEngine.stopEntryPage()
      setTimeout(onComplete, 300)
      return
    }

    // New player
    const player: Player = {
      username: username.trim(),
      phone: phone.trim(),
      registeredAt: Date.now(),
      completedLevels: [],
      score: 0,
      completedAt: null,
    }
    setCurrentPlayer(player)
    AudioEngine.stopEntryPage()
    setTimeout(onComplete, 300)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#020205' }}>

      {/* Hallway lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.07 }} preserveAspectRatio="none">
        <line x1="50%" y1="0" x2="5%" y2="100%" stroke="#3a2a1a" strokeWidth="1"/>
        <line x1="50%" y1="0" x2="95%" y2="100%" stroke="#3a2a1a" strokeWidth="1"/>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md px-6"
      >
        {/* Title */}
        <div className="text-center mb-10">
          <div style={{ fontFamily: "'Special Elite', serif", fontSize: '3rem', color: '#f5c842',
            textShadow: '0 0 30px rgba(245,200,66,0.4)', letterSpacing: '0.1em', lineHeight: 1.1 }}>
            CHIP<br/>SYNC
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', color: '#8b0000', fontSize: '0.7rem',
            letterSpacing: '0.3em', marginTop: '0.5rem' }}>
            ◆ HIDE AND SEEK ◆
          </div>
        </div>

        {/* Form */}
        <div className="door-frame p-6 space-y-5" style={{ borderColor: '#8b000044',
          background: 'linear-gradient(135deg, #8b000011, #0a0806)' }}>

          <div className="text-center" style={{ fontFamily: "'Special Elite', serif",
            color: '#8b6a4a', fontSize: '0.9rem', fontStyle: 'italic' }}>
            BEGIN THE JOURNEY <em>~seek the light beyond the darkness</em>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.6rem',
                letterSpacing: '0.2em', display: 'block', marginBottom: '0.4rem' }}>
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="your name or team name..."
                autoComplete="off"
                maxLength={30}
                style={{
                  width: '100%', background: 'transparent', border: 'none',
                  borderBottom: '1px solid #8b000066', color: '#f5c842',
                  fontFamily: 'JetBrains Mono', fontSize: '0.9rem', outline: 'none',
                  padding: '0.5rem 0.25rem', caretColor: '#f5c842',
                  pointerEvents: 'auto', zIndex: 100, position: 'relative',
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.6rem',
                letterSpacing: '0.2em', display: 'block', marginBottom: '0.4rem' }}>
                PHONE NUMBER
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit number..."
                autoComplete="off"
                style={{
                  width: '100%', background: 'transparent', border: 'none',
                  borderBottom: '1px solid #8b000066', color: '#f5c842',
                  fontFamily: 'JetBrains Mono', fontSize: '0.9rem', outline: 'none',
                  padding: '0.5rem 0.25rem', caretColor: '#f5c842',
                  pointerEvents: 'auto', zIndex: 100, position: 'relative',
                }}
              />
            </div>

            {error && (
              <div style={{ fontFamily: 'JetBrains Mono', color: '#ff0033', fontSize: '0.65rem' }}>
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="haunted-btn w-full py-3 tracking-widest"
              style={{ fontFamily: "'Special Elite', serif", fontSize: '1rem',
                borderColor: '#f5c84288', color: '#f5c842', marginTop: '0.5rem' }}
            >
              {submitting ? '...' : '↳ ENTER THE HAUNTED HOUSE ↲'}
            </button>
          </form>
        </div>

        <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.55rem',
          textAlign: 'center', marginTop: '1rem', letterSpacing: '0.1em' }}>
          returning? enter same phone number to restore progress
        </div>
      </motion.div>

      {/* Blood drips */}
      {[15, 40, 65, 88].map((left, i) => (
        <div key={i} className="absolute top-0 pointer-events-none" style={{
          left: `${left}%`, width: '2px', height: `${12 + i * 8}%`,
          background: 'linear-gradient(to bottom, #8b0000, transparent)', opacity: 0.3 }} />
      ))}
    </div>
  )
}

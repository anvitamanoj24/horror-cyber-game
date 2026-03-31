'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { AudioEngine } from '@/lib/audioEngine'
import type { Level } from '@/data/episodes'

interface MasterRiddleProps {
  level: Level
  onSolve: () => void
  onFail: () => void
}

export default function MasterRiddle({ level, onSolve, onFail }: MasterRiddleProps) {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (submitted) return
    const normalized = input.trim().toLowerCase()
    if (normalized === level.masterAnswer) {
      setSubmitted(true)
      AudioEngine.playCorrect()
      setTimeout(onSolve, 1000)
    } else {
      AudioEngine.playIncorrect()
      setShake(true)
      setTimeout(() => { setShake(false); onFail() }, 600)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl"
    >
      <motion.div
        animate={shake ? { x: [-10, 10, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="door-frame relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${level.color}22 0%, #0a0806 50%, #020205 100%)`,
          borderColor: level.color + '66',
          boxShadow: `0 0 40px ${level.color}22`,
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: level.color + '33' }}
        >
          <div
            style={{
              fontFamily: "'Special Elite', serif",
              color: level.color,
              fontSize: '1.1rem',
              letterSpacing: '0.15em',
              textShadow: `0 0 20px ${level.color}66`,
            }}
          >
            ⚰ THE FINAL LOCK — {level.title}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.6rem', marginTop: '0.25rem' }}>
            SOLVE THIS TO CLAIM THE FRAGMENT AND UNLOCK THE NEXT ROOM
          </div>
        </div>

        {/* Fragment reward preview */}
        <div
          className="mx-6 mt-4 p-3"
          style={{
            background: `${level.color}11`,
            border: `1px solid ${level.color}33`,
            fontFamily: 'JetBrains Mono',
          }}
        >
          <div style={{ color: level.color + '88', fontSize: '0.6rem', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>
            FRAGMENT REWARD
          </div>
          <div style={{ color: level.color, fontSize: '0.75rem' }}>◈ {level.fragment}</div>
          <div style={{ color: '#3a2a1a', fontSize: '0.6rem', marginTop: '0.25rem' }}>{level.fragmentDesc}</div>
        </div>

        {/* Riddle */}
        <div className="px-6 py-5">
          <p
            style={{
              fontFamily: "'Special Elite', serif",
              color: '#c8d8e8',
              fontSize: '0.95rem',
              lineHeight: 1.8,
              fontStyle: 'italic',
            }}
          >
            "{level.masterRiddle}"
          </p>
        </div>

        {/* Input */}
        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2">
              <span style={{ color: level.color, fontFamily: 'JetBrains Mono' }}>›</span>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={submitted}
                placeholder="your answer..."
                autoComplete="off"
                spellCheck={false}
                className="ghost-input flex-1 py-2 text-sm"
                style={{ borderBottomColor: level.color + '44', caretColor: level.color }}
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={submitted || !input.trim()}
              className="haunted-btn w-full py-3 text-sm tracking-widest"
              style={{ borderColor: level.color + '66', color: level.color }}
            >
              [ UNLOCK THE DOOR ]
            </button>
          </form>

          <p style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.65rem', marginTop: '0.75rem' }}>
            💀 hint: {level.masterHint}
          </p>
        </div>

        {/* Corner ornaments */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: level.color + '44' }}/>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: level.color + '44' }}/>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: level.color + '44' }}/>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: level.color + '44' }}/>
      </motion.div>
    </motion.div>
  )
}

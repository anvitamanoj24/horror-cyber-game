'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { LEVELS } from '@/data/episodes'

export default function InnovationPortal() {
  const { fragments, portalIdea, setPortalIdea } = useGameStore()
  const [submitted, setSubmitted] = useState(false)
  const [charCount, setCharCount] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPortalIdea(e.target.value)
    setCharCount(e.target.value.length)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (portalIdea.trim().length < 30) return
    setSubmitted(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
      style={{ background: '#020205' }}
    >
      {/* Subtle warm light — the study lamp */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(245,200,66,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Desk surface line */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '30%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, #3a2a1a44, transparent)',
        }}
      />

      <div className="relative z-10 w-full max-w-3xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center"
        >
          <div
            style={{
              fontFamily: "'Special Elite', serif",
              fontSize: '2.2rem',
              color: '#f5c842',
              textShadow: '0 0 30px rgba(245,200,66,0.3)',
              letterSpacing: '0.1em',
            }}
          >
            THE STUDY DESK
          </div>
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              color: '#8b6a4a',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              marginTop: '0.5rem',
            }}
          >
            ALL 40 ROOMS CLEARED · THE HOUSE IS YOURS
          </div>
        </motion.div>

        {/* 4 Fragments */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-2 gap-3"
        >
          {LEVELS.map((level, i) => (
            <motion.div
              key={level.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.2 }}
              className="door-frame p-4"
              style={{
                background: `linear-gradient(135deg, ${level.color}11, #0a0806)`,
                borderColor: level.color + '44',
              }}
            >
              <div
                style={{
                  fontFamily: 'JetBrains Mono',
                  color: level.color + '88',
                  fontSize: '0.55rem',
                  letterSpacing: '0.2em',
                  marginBottom: '0.25rem',
                }}
              >
                FRAGMENT {level.id} — {level.room.toUpperCase()}
              </div>
              <div
                style={{
                  fontFamily: "'Special Elite', serif",
                  color: level.color,
                  fontSize: '0.85rem',
                }}
              >
                ◈ {level.fragment}
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono',
                  color: '#3a2a1a',
                  fontSize: '0.6rem',
                  marginTop: '0.4rem',
                  lineHeight: 1.5,
                }}
              >
                {level.fragmentDesc}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Innovation trigger */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="p-4 border"
          style={{
            borderColor: '#f5c84233',
            background: 'rgba(245,200,66,0.03)',
            fontFamily: 'JetBrains Mono',
          }}
        >
          <div style={{ color: '#f5c842', fontSize: '0.7rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
            INNOVATION TRIGGER:
          </div>
          <p style={{ color: '#8b6a4a', fontSize: '0.75rem', lineHeight: 1.7, fontStyle: 'italic' }}>
            "You found the <span style={{ color: '#8b0000' }}>Acoustic Sensor</span> in the Basement
            and the <span style={{ color: '#1a3a5c' }}>Low Power Logic</span> in the Study.
            The <span style={{ color: '#1a3a1a' }}>Silicon Blueprint</span> from the Lab
            and the <span style={{ color: '#3a1a5c' }}>Neuromorphic Platform</span> from the Attic.
            How will you use these to haunt the future of Healthcare?"
          </p>
        </motion.div>

        {/* Typewriter / submission */}
        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6 }}
          >
            {/* Typewriter frame */}
            <div
              className="door-frame p-1"
              style={{ borderColor: '#8b6a4a44', background: '#0a0806' }}
            >
              <div
                className="p-2 border-b flex items-center gap-2"
                style={{ borderColor: '#3a2a1a' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: '#8b0000' }}/>
                <div className="w-2 h-2 rounded-full" style={{ background: '#ff6b00' }}/>
                <div className="w-2 h-2 rounded-full" style={{ background: '#f5c842' }}/>
                <span
                  style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.6rem', marginLeft: '0.5rem' }}
                >
                  hackathon_proposal.txt
                </span>
              </div>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={portalIdea}
                  onChange={handleChange}
                  placeholder="Type your hackathon project idea here. Synthesize all 4 fragments: Acoustic Sensor + Low Power Logic + Silicon Blueprint + Neuromorphic Platform..."
                  style={{
                    background: 'transparent',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '0.8rem',
                    color: '#c8d8e8',
                    caretColor: '#f5c842',
                    lineHeight: '1.7',
                    border: 'none',
                    width: '100%',
                    padding: '1rem',
                    resize: 'none',
                    outline: 'none',
                    minHeight: '160px',
                  } as React.CSSProperties}
                  autoFocus
                />
                <div
                  className="flex items-center justify-between px-4 py-2 border-t"
                  style={{ borderColor: '#3a2a1a' }}
                >
                  <span style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.6rem' }}>
                    {charCount} chars {charCount < 30 ? `(min 30)` : '✓'}
                  </span>
                  <button
                    type="submit"
                    disabled={portalIdea.trim().length < 30}
                    className="haunted-btn px-6 py-2 text-xs tracking-widest"
                    style={{ borderColor: '#f5c84266', color: '#f5c842' }}
                  >
                    [ SUBMIT PROPOSAL ]
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-4"
          >
            <div
              style={{
                fontFamily: "'Special Elite', serif",
                fontSize: '3rem',
                color: '#f5c842',
                textShadow: '0 0 20px rgba(245,200,66,0.4)',
              }}
            >
              ✦
            </div>
            <div
              style={{
                fontFamily: "'Special Elite', serif",
                fontSize: '1.4rem',
                color: '#f5c842',
                letterSpacing: '0.15em',
              }}
            >
              PROPOSAL ACCEPTED
            </div>
            <div
              className="p-4 border text-left"
              style={{
                borderColor: '#f5c84233',
                background: 'rgba(245,200,66,0.03)',
                fontFamily: 'JetBrains Mono',
                fontSize: '0.8rem',
                color: '#8b6a4a',
                lineHeight: 1.7,
              }}
            >
              {portalIdea}
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono',
                color: '#3a2a1a',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
              }}
            >
              THE HAUNTED CURRICULUM IS COMPLETE.
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

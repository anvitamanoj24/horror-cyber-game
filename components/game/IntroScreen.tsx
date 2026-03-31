'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLightContext } from '@/lib/lightContext'

interface IntroScreenProps {
  onStart: () => void
}

const LINES = [
  "> SYSTEM BREACH DETECTED...",
  "> LOADING: haunted_curriculum_v4.exe",
  "> 40 EPISODES. 4 LOCKED ROOMS.",
  "> ONE WRONG ANSWER = PERMANENT LOCKOUT.",
  "> TAB SWITCH = INSTANT FAILURE.",
  "> THE HOUSE IS WATCHING.",
  "",
  "> ARE YOU READY TO ENTER?",
]

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [showButton, setShowButton] = useState(false)
  const { setEpisodeId } = useLightContext()

  // Reset light and set a unique page id so bulb moves
  useEffect(() => { setEpisodeId(99) }, [setEpisodeId])

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleLines(i)
      if (i >= LINES.length) {
        clearInterval(interval)
        setTimeout(() => setShowButton(true), 600)
      }
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#020205' }}
    >
      {/* Victorian hallway background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, #020205 0%, transparent 20%, transparent 80%, #020205 100%),
            repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(58,42,26,0.15) 80px, rgba(58,42,26,0.15) 82px),
            repeating-linear-gradient(0deg, transparent, transparent 120px, rgba(58,42,26,0.1) 120px, rgba(58,42,26,0.1) 122px)
          `,
        }}
      />

      {/* Hallway perspective lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.12 }}>
        <line x1="50%" y1="0%" x2="10%" y2="100%" stroke="#3a2a1a" strokeWidth="1"/>
        <line x1="50%" y1="0%" x2="90%" y2="100%" stroke="#3a2a1a" strokeWidth="1"/>
        <line x1="50%" y1="0%" x2="25%" y2="100%" stroke="#3a2a1a" strokeWidth="0.5"/>
        <line x1="50%" y1="0%" x2="75%" y2="100%" stroke="#3a2a1a" strokeWidth="0.5"/>
        {/* Floor boards */}
        {[20,35,50,65,80].map(y => (
          <line key={y} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#3a2a1a" strokeWidth="0.5"/>
        ))}
      </svg>

      {/* Lantern glow at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)',
          animation: 'lanternPulse 2s ease-in-out infinite',
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 w-full max-w-2xl px-8"
      >
        {/* Title */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="glitch flicker"
            style={{
              fontFamily: "'Special Elite', serif",
              fontSize: '2.8rem',
              color: '#f5c842',
              textShadow: '0 0 30px rgba(245,200,66,0.4), 0 0 60px rgba(245,200,66,0.1)',
              letterSpacing: '0.1em',
              lineHeight: 1.2,
            }}
          >
            THE HAUNTED<br/>CURRICULUM
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ color: '#8b0000', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', letterSpacing: '0.3em', marginTop: '0.5rem' }}
          >
            ◆ KTU ELECTRONICS · 40 EPISODES · 4 LOCKED ROOMS ◆
          </motion.p>
        </div>

        {/* Terminal boot text */}
        <div
          className="worn-paper p-6 mb-8 relative"
          style={{ minHeight: '220px' }}
        >
          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l" style={{ borderColor: '#8b000066' }}/>
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r" style={{ borderColor: '#8b000066' }}/>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l" style={{ borderColor: '#8b000066' }}/>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r" style={{ borderColor: '#8b000066' }}/>

          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', lineHeight: '1.8' }}>
            {LINES.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  color: line.startsWith('>') ? '#c8d8e8' : '#3a2a1a',
                  minHeight: '1.4rem',
                }}
              >
                {line || '\u00A0'}
                {i === visibleLines - 1 && !showButton && (
                  <span
                    style={{ color: '#f5c842', animation: 'flicker 0.8s infinite' }}
                  >█</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Warning + Enter button */}
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div
                className="text-center text-xs p-3"
                style={{
                  fontFamily: 'JetBrains Mono',
                  color: '#8b0000',
                  border: '1px solid #8b000044',
                  background: 'rgba(139,0,0,0.05)',
                  letterSpacing: '0.1em',
                }}
              >
                ⚠ &nbsp; ONE WRONG ANSWER SEALS THE DOOR FOREVER &nbsp; ⚠
              </div>

              <button
                onClick={onStart}
                className="haunted-btn w-full py-4 text-sm tracking-widest"
                style={{ fontFamily: "'Special Elite', serif", fontSize: '1rem', letterSpacing: '0.2em' }}
              >
                ↳ &nbsp; ENTER THE HOUSE &nbsp; ↲
              </button>

              <p
                className="text-center text-xs"
                style={{ color: '#3a2a1a', fontFamily: 'JetBrains Mono', letterSpacing: '0.1em' }}
              >
                4 rooms · 10 episodes each · permadeath enabled
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Blood drip decorations */}
      {[15, 35, 65, 85].map((left, i) => (
        <div
          key={i}
          className="absolute top-0 pointer-events-none"
          style={{
            left: `${left}%`,
            width: '2px',
            height: `${20 + i * 15}px`,
            background: 'linear-gradient(to bottom, #8b0000, transparent)',
            opacity: 0.4,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  )
}

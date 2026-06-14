'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LEVELS } from '@/data/episodes'
import { useLightContext } from '@/lib/lightContext'
import { AudioEngine } from '@/lib/audioEngine'

interface LevelBriefProps {
  levelId: number
  onEnter: () => void
  onBack: () => void
}

const LEVEL_LORE: Record<number, string[]> = {
  1: [
    "You enter the CHIPSYNC basement. Silicon wafers line the walls.",
    "The air smells of photoresist and clean-room chemicals.",
    "A chip layout glows on the screen. Something is unrouted.",
    "10 VLSI physical design puzzles await. Placement. Routing. Timing.",
    "Prove you understand the flow from netlist to tape-out.",
  ],
  2: [
    "The study door is sealed. The admin has not opened it yet.",
    "Return when Week 2 begins.",
    "The ghost of digital logic waits patiently inside.",
    "Logic gates. RTL. Verilog. It will be ready.",
    "Check back soon.",
  ],
  3: [
    "The lab is locked. Cold. Silent.",
    "Silicon fabrication secrets are stored within.",
    "The admin holds the key to this room.",
    "Lithography. CMOS. Process nodes.",
    "It opens when the time comes.",
  ],
  4: [
    "The attic is the highest room. The final challenge.",
    "Neuromorphic computing. Edge AI. The future of chips.",
    "No one has reached this room yet.",
    "The ghost of innovation waits at the top.",
    "Unlock Week 4 to enter.",
  ],
}

export default function LevelBrief({ levelId, onEnter, onBack }: LevelBriefProps) {
  const level = LEVELS[levelId - 1]
  const lore = LEVEL_LORE[levelId]
  const [visibleLines, setVisibleLines] = useState(0)
  const [ready, setReady] = useState(false)
  const { setEpisodeId } = useLightContext()

  // Reset light on mount
  useEffect(() => { setEpisodeId(97) }, [setEpisodeId])

  // Reveal lore lines one by one
  useState(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleLines(i)
      if (i >= lore.length) {
        clearInterval(interval)
        setTimeout(() => setReady(true), 500)
      }
    }, 600)
    return () => clearInterval(interval)
  })

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#020205' }}
    >
      {/* Hallway lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }} preserveAspectRatio="none">
        <line x1="50%" y1="0" x2="5%"  y2="100%" stroke="#3a2a1a" strokeWidth="1"/>
        <line x1="50%" y1="0" x2="95%" y2="100%" stroke="#3a2a1a" strokeWidth="1"/>
      </svg>

      <div className="relative z-10 w-full max-w-xl px-8 space-y-8">

        {/* Level title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div style={{ fontFamily: 'JetBrains Mono', color: level.color + '88', fontSize: '0.6rem', letterSpacing: '0.3em', marginBottom: '0.4rem' }}>
            LEVEL {level.id} · {level.room.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: "'Special Elite', serif",
              fontSize: '2.4rem',
              color: level.color,
              textShadow: `0 0 30px ${level.color}66`,
              letterSpacing: '0.1em',
            }}
          >
            {level.title}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.6rem', marginTop: '0.3rem', letterSpacing: '0.15em' }}>
            {level.theme}
          </div>
        </motion.div>

        {/* Lore text — lines appear one by one */}
        <div
          className="door-frame p-6 space-y-3 relative"
          style={{ borderColor: level.color + '33', background: `linear-gradient(135deg, ${level.color}08, #0a0806)` }}
        >
          {/* Corner ornaments */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: level.color + '44' }}/>
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: level.color + '44' }}/>
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: level.color + '44' }}/>
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: level.color + '44' }}/>

          {lore.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: i < visibleLines ? 1 : 0, x: i < visibleLines ? 0 : -10 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: "'Special Elite', serif",
                color: i === lore.length - 1 ? level.color : '#8b6a4a',
                fontSize: '0.85rem',
                fontStyle: 'italic',
                lineHeight: 1.7,
              }}
            >
              {i < visibleLines ? `> ${line}` : ''}
              {i === visibleLines - 1 && !ready && (
                <span style={{ color: level.color, animation: 'flicker 0.8s infinite' }}>█</span>
              )}
            </motion.p>
          ))}
        </div>

        {/* Fragment reward preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: visibleLines >= 3 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 border"
          style={{ borderColor: level.color + '22', background: `${level.color}08`, fontFamily: 'JetBrains Mono' }}
        >
          <div style={{ color: level.color + '66', fontSize: '0.55rem', letterSpacing: '0.2em', marginBottom: '0.3rem' }}>
            COMPLETE ALL 10 ROOMS TO COLLECT:
          </div>
          <div style={{ color: level.color, fontSize: '0.8rem' }}>◈ {level.fragment}</div>
          <div style={{ color: '#3a2a1a', fontSize: '0.6rem', marginTop: '0.25rem' }}>{level.fragmentDesc}</div>
        </motion.div>

        {/* Buttons */}
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-4"
          >
            <button
              onClick={onBack}
              className="haunted-btn px-6 py-3 text-xs tracking-widest"
              style={{ borderColor: '#3a2a1a', color: '#3a2a1a', flex: '0 0 auto' }}
            >
              ← BACK
            </button>
            <button
              onClick={() => { AudioEngine.playDoorCreak(); setTimeout(onEnter, 1400) }}
              className="haunted-btn flex-1 py-3 text-sm tracking-widest"
              style={{ borderColor: level.color + '88', color: level.color, fontFamily: "'Special Elite', serif", fontSize: '1rem' }}
            >
              ↳ ENTER THE {level.title.split(' ')[1] || level.title}
            </button>
          </motion.div>
        )}
      </div>

      {/* Blood drips */}
      {[15, 45, 75].map((left, i) => (
        <div key={i} className="absolute top-0 pointer-events-none" style={{
          left: `${left}%`, width: '2px',
          height: `${15 + i * 10}%`,
          background: `linear-gradient(to bottom, ${level.color}, transparent)`,
          opacity: 0.2,
        }}/>
      ))}
    </div>
  )
}

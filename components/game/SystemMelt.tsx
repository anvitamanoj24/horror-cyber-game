'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AudioEngine } from '@/lib/audioEngine'

export default function SystemMelt() {
  useEffect(() => {
    AudioEngine.playMelt()
    AudioEngine.stopAmbience()
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#020205' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Glitch horizontal lines */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-full"
          style={{
            top: `${i * 7}%`,
            height: `${1 + Math.random() * 3}px`,
            background: `rgba(139,0,0,${0.1 + Math.random() * 0.3})`,
          }}
          animate={{
            x: [0, Math.random() * 60 - 30, 0],
            opacity: [0.2, 0.8, 0],
            scaleX: [1, 1.05, 1],
          }}
          transition={{
            duration: 0.2 + Math.random() * 0.4,
            repeat: 10,
            delay: Math.random() * 0.8,
          }}
        />
      ))}

      <motion.div
        animate={{
          filter: ['blur(0px)', 'blur(3px)', 'blur(0px)', 'blur(6px)', 'blur(2px)'],
          y: [0, 8, -4, 15, 30],
          skewX: [0, -2, 2, -1, 0],
        }}
        transition={{ duration: 2.8, ease: 'easeIn' }}
        className="text-center space-y-6 relative z-10"
      >
        <div
          style={{
            fontFamily: "'Special Elite', serif",
            fontSize: '5rem',
            color: '#8b0000',
            textShadow: '0 0 40px #ff0000, 0 0 80px #8b0000',
            lineHeight: 1,
          }}
        >
          ☠
        </div>
        <div
          style={{
            fontFamily: "'Special Elite', serif",
            fontSize: '2rem',
            color: '#8b0000',
            letterSpacing: '0.2em',
            textShadow: '0 0 20px #ff0000',
          }}
        >
          THE DOOR SEALS
        </div>
        <div
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '0.8rem',
            color: '#8b000088',
            letterSpacing: '0.2em',
          }}
        >
          WRONG ANSWER DETECTED
        </div>
        <div
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '0.65rem',
            color: '#8b000055',
            letterSpacing: '0.15em',
          }}
        >
          INITIATING PERMANENT LOCKOUT...
        </div>
      </motion.div>

      {/* Blood drips from top */}
      {[10, 25, 40, 55, 70, 85].map((left, i) => (
        <motion.div
          key={i}
          className="absolute top-0"
          style={{ left: `${left}%`, width: '2px' }}
          initial={{ height: 0, opacity: 0.8 }}
          animate={{ height: `${30 + i * 10}%`, opacity: 0.5 }}
          transition={{ duration: 1.5 + i * 0.2, delay: i * 0.1 }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to bottom, #8b0000, #8b000033)',
              boxShadow: '0 0 4px #ff0000',
            }}
          />
        </motion.div>
      ))}

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,0,0,0.04) 2px, rgba(139,0,0,0.04) 4px)',
        }}
      />
    </motion.div>
  )
}

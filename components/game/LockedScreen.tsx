'use client'
import { motion } from 'framer-motion'

interface LockedScreenProps {
  lockedAt: number | null
}

export default function LockedScreen({ lockedAt }: LockedScreenProps) {
  const date = lockedAt ? new Date(lockedAt).toLocaleString() : 'UNKNOWN'

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center p-8 overflow-hidden"
      style={{ background: '#020205' }}
    >
      {/* Blood drips */}
      {[8, 20, 35, 50, 65, 78, 92].map((left, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: `${left}%`,
            width: '2px',
            height: `${15 + i * 8}%`,
            background: 'linear-gradient(to bottom, #8b0000, transparent)',
            opacity: 0.4,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        className="text-center space-y-8 max-w-lg relative z-10"
      >
        <div
          style={{
            fontFamily: "'Special Elite', serif",
            fontSize: '6rem',
            color: '#8b0000',
            textShadow: '0 0 30px #8b0000',
            lineHeight: 1,
          }}
        >
          ⛔
        </div>

        <div
          style={{
            fontFamily: "'Special Elite', serif",
            fontSize: '1.8rem',
            color: '#8b0000',
            letterSpacing: '0.15em',
            textShadow: '0 0 15px #8b0000',
          }}
        >
          THE HOUSE REMEMBERS
        </div>

        <div
          className="p-6 border space-y-3"
          style={{
            borderColor: '#8b000033',
            background: 'rgba(139,0,0,0.04)',
            fontFamily: 'JetBrains Mono',
          }}
        >
          <p style={{ color: '#8b4a4a', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            YOU GAVE A WRONG ANSWER.
          </p>
          <p style={{ color: '#8b4a4a', fontSize: '0.8rem' }}>
            THE DOOR HAS BEEN SEALED PERMANENTLY.
          </p>
          <p style={{ color: '#3a1a1a', fontSize: '0.7rem', marginTop: '1rem' }}>
            SEALED AT: {date}
          </p>
          <p style={{ color: '#3a1a1a', fontSize: '0.65rem' }}>
            NO FURTHER ACCESS WILL BE GRANTED.
          </p>
        </div>

        <div
          style={{
            fontFamily: 'JetBrains Mono',
            color: '#3a1a1a',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
          }}
        >
          01010011 01000101 01000001 01001100 01000101 01000100
        </div>
      </motion.div>

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,0,0,0.02) 3px, rgba(139,0,0,0.02) 6px)',
        }}
      />
    </div>
  )
}

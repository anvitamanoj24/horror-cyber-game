'use client'
import { motion } from 'framer-motion'

interface PCBTraceProps {
  completed: boolean
  vertical?: boolean
  length?: number
}

export default function PCBTrace({ completed, vertical = true, length = 60 }: PCBTraceProps) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={vertical ? { width: 4, height: length } : { width: length, height: 4 }}
    >
      {/* Base trace */}
      <div
        className="absolute rounded-full"
        style={
          vertical
            ? { width: 2, height: '100%', background: '#1a1a1a' }
            : { height: 2, width: '100%', background: '#1a1a1a' }
        }
      />
      {/* Glow fill when completed */}
      {completed && (
        <motion.div
          className="absolute rounded-full"
          initial={vertical ? { height: 0 } : { width: 0 }}
          animate={vertical ? { height: '100%' } : { width: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={
            vertical
              ? { width: 2, background: '#00ff41', boxShadow: '0 0 8px #00ff41', top: 0 }
              : { height: 2, background: '#00ff41', boxShadow: '0 0 8px #00ff41', left: 0 }
          }
        />
      )}
    </div>
  )
}

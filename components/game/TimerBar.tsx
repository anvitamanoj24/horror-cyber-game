'use client'
import { motion } from 'framer-motion'

interface TimerBarProps {
  timeLeft: number
  totalTime: number
}

export default function TimerBar({ timeLeft, totalTime }: TimerBarProps) {
  const pct = (timeLeft / totalTime) * 100
  const color = pct > 50 ? '#00ff41' : pct > 25 ? '#ffaa00' : '#ff0033'

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-mono mb-1" style={{ color }}>
        <span>TIMER</span>
        <span style={{ textShadow: `0 0 8px ${color}` }}>
          {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
          {String(timeLeft % 60).padStart(2, '0')}
        </span>
      </div>
      <div className="w-full h-1 bg-gray-900 rounded overflow-hidden">
        <motion.div
          className="h-full rounded"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        />
      </div>
    </div>
  )
}

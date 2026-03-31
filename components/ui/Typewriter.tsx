'use client'
import { useEffect, useState, useRef } from 'react'
import { AudioEngine } from '@/lib/audioEngine'

interface TypewriterProps {
  text: string
  speed?: number
  className?: string
  onDone?: () => void
}

export default function Typewriter({ text, speed = 40, className = '', onDone }: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')
  const indexRef = useRef(0)
  const textRef = useRef(text)

  useEffect(() => {
    textRef.current = text
    indexRef.current = 0
    setDisplayed('')

    const interval = setInterval(() => {
      if (indexRef.current < textRef.current.length) {
        const char = textRef.current[indexRef.current]
        setDisplayed(prev => prev + char)
        if (char !== ' ') AudioEngine.playTyping()
        indexRef.current++
      } else {
        clearInterval(interval)
        onDone?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed]) // eslint-disable-line

  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse text-neon-green">█</span>
    </span>
  )
}

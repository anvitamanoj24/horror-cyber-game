'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTimer } from '@/hooks/useTimer'
import { useAntiCheat } from '@/hooks/useAntiCheat'
import { AudioEngine } from '@/lib/audioEngine'
import { LEVELS } from '@/data/episodes'
import { useLightContext } from '@/lib/lightContext'
import type { Episode } from '@/data/episodes'

interface EpisodeCardProps {
  episode: Episode
  onCorrect: () => void
  onFail: () => void
}

const PUZZLE_ICONS: Record<string, string> = {
  lateral: '🕯️', morse: '📡', hidden: '🔍', logic: '⚙️', riddle: '👁️',
}

const CORRECT_MESSAGES = [
  "⚡ Brilliant. The ghost retreats.",
  "✦ Correct. The door creaks open.",
  "🕯️ Well done. The darkness lifts.",
  "☠ Impressive. The circuit completes.",
  "🔓 Exactly right. You may proceed.",
  "✓ The ghost nods. Move forward.",
  "💡 Perfect. The room remembers you.",
]

const GRACE_SECONDS = 5
const MAX_LIVES = 3

type Phase = 'dark' | 'reading' | 'active' | 'correct' | 'dead'

export default function EpisodeCard({ episode, onCorrect, onFail }: EpisodeCardProps) {
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)
  const [phase, setPhase] = useState<Phase>('dark')
  const [lives, setLives] = useState(MAX_LIVES)
  const [showHint, setShowHint] = useState(false)
  const [graceLeft, setGraceLeft] = useState(GRACE_SECONDS)
  const [correctMsg, setCorrectMsg] = useState('')
  const [timerKey, setTimerKey] = useState(0) // increment to force timer reset
  const inputRef = useRef<HTMLInputElement>(null)
  const graceRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phaseRef = useRef<Phase>('dark')
  const livesRef = useRef(MAX_LIVES)

  const level = LEVELS[episode.level - 1]
  const { lightOn, setEpisodeId, resetLight } = useLightContext()

  const clearGrace = () => {
    if (graceRef.current) { clearInterval(graceRef.current); graceRef.current = null }
  }

  // Sync refs
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { livesRef.current = lives }, [lives])

  // ── Reset on new episode ──
  useEffect(() => {
    clearGrace()
    setEpisodeId(episode.id) // also calls resetLight inside context
    setInput('')
    setPhase('dark')
    phaseRef.current = 'dark'
    setLives(MAX_LIVES)
    livesRef.current = MAX_LIVES
    setShowHint(false)
    setGraceLeft(GRACE_SECONDS)
    setCorrectMsg('')
    setTimerKey(k => k + 1)
  }, [episode.id]) // eslint-disable-line

  // ── Grace period: fires when lightOn flips true while phase === 'dark' ──
  useEffect(() => {
    if (!lightOn) return
    if (phaseRef.current !== 'dark') return

    clearGrace()
    setPhase('reading')
    phaseRef.current = 'reading'

    let g = GRACE_SECONDS
    setGraceLeft(g)

    graceRef.current = setInterval(() => {
      g -= 1
      setGraceLeft(g)
      if (g <= 0) {
        clearGrace()
        setPhase('active')
        phaseRef.current = 'active'
        setTimerKey(k => k + 1) // fresh timer every attempt
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    }, 1000)

    return clearGrace
  }, [lightOn]) // eslint-disable-line

  // ── Fail handler ──
  const handleFail = useCallback(() => {
    if (phaseRef.current === 'dead' || phaseRef.current === 'correct') return

    AudioEngine.playIncorrect()
    setShake(true)
    setTimeout(() => setShake(false), 500)
    setShowHint(true)
    setInput('')

    const nextLives = livesRef.current - 1
    setLives(nextLives)
    livesRef.current = nextLives

    if (nextLives <= 0) {
      setPhase('dead')
      phaseRef.current = 'dead'
      // Play 3-attempts sound, then call onFail when sound ends
      AudioEngine.play3Attempts(() => onFail())
    } else {
      // Stay on same question, restart timer — light stays ON
      setTimerKey(k => k + 1)
      setPhase('active')
      phaseRef.current = 'active'
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [onFail])

  const { timeLeft, dropToOne } = useTimer({
    seconds: episode.timerSeconds,
    onExpire: handleFail,
    active: phase === 'active',
    resetKey: timerKey,
  })

  useAntiCheat(() => dropToOne(), phase === 'active')

  // ── Submit ──
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (phase !== 'active' || !input.trim()) return
    if (input.trim().toLowerCase() === episode.answer) {
      AudioEngine.playCorrect()
      setCorrectMsg(CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)])
      setPhase('correct')
      phaseRef.current = 'correct'
      resetLight() // screen goes dark before next question
      setTimeout(onCorrect, 1800)
    } else {
      handleFail()
    }
  }

  const pct = (timeLeft / episode.timerSeconds) * 100
  const timerColor = pct > 50 ? level.color : pct > 25 ? '#ff6b00' : '#ff0000'

  return (
    <motion.div
      animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl"
      style={{ position: 'relative', zIndex: 20 }}
    >
      <div
        className="door-frame relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${level.color}11 0%, #0a0806 40%, #020205 100%)`,
          borderColor: phase === 'correct' ? level.color + 'cc' : level.color + '44',
          boxShadow: phase === 'correct' ? `0 0 30px ${level.color}44` : 'none',
          transition: 'box-shadow 0.4s, border-color 0.4s',
        }}
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: level.color + '22' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '1.1rem' }}>{PUZZLE_ICONS[episode.puzzleType]}</span>
            <div>
              <div style={{ fontFamily: "'Special Elite', serif", color: level.color, fontSize: '0.75rem', letterSpacing: '0.15em' }}>
                {level.title}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.6rem' }}>
                ROOM {episode.episodeInLevel} OF 10 · #{episode.id}/40
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex gap-1">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <span key={i} style={{ fontSize: '0.75rem', opacity: i < lives ? 1 : 0.15 }}>🩸</span>
              ))}
            </div>

            {phase === 'dark' && (
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: '#3a2a1a', letterSpacing: '0.1em' }}>
                {lives < MAX_LIVES ? `${lives} ${lives === 1 ? 'life' : 'lives'} left — find bulb` : 'find the bulb...'}
              </div>
            )}
            {phase === 'reading' && (
              <div className="text-right">
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.4rem', color: '#f5c842', textShadow: '0 0 10px #f5c842', fontWeight: 'bold' }}>{graceLeft}</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.5rem', color: '#f5c84266' }}>READ</div>
              </div>
            )}
            {phase === 'active' && (
              <div className="text-right">
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.4rem', color: timerColor, textShadow: `0 0 10px ${timerColor}`, fontWeight: 'bold', transition: 'color 0.5s' }}>
                  {String(timeLeft).padStart(2, '0')}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.5rem', color: timerColor + '66' }}>SECONDS</div>
              </div>
            )}
            {phase === 'correct' && <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: level.color }}>✓ CORRECT</div>}
            {phase === 'dead' && <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#ff0000' }}>☠ FAILED</div>}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full h-0.5" style={{ background: '#1a1208' }}>
          {phase === 'active' && (
            <motion.div key={`timer-${timerKey}`} className="h-full"
              initial={{ width: '100%' }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: 'linear' }}
              style={{ background: timerColor, boxShadow: `0 0 6px ${timerColor}` }} />
          )}
          {phase === 'reading' && (
            <motion.div className="h-full"
              animate={{ width: `${(graceLeft / GRACE_SECONDS) * 100}%` }}
              transition={{ duration: 0.9, ease: 'linear' }}
              style={{ background: '#f5c842', boxShadow: '0 0 6px #f5c842' }} />
          )}
        </div>

        {/* FLAVOR TEXT */}
        <div className="px-5 pt-4 pb-2">
          <p style={{ fontFamily: "'Special Elite', serif", color: '#8b6a4a', fontSize: '0.8rem', fontStyle: 'italic', lineHeight: 1.6 }}>
            {episode.flavor}
          </p>
        </div>

        <div className="mx-5 my-2 border-t" style={{ borderColor: level.color + '22' }} />

        {/* QUESTION — blurred until bulb is clicked (lightOn) */}
        <div className="px-5 pb-4" style={{ position: 'relative' }}>
          <p style={{
            fontFamily: 'JetBrains Mono', color: '#c8d8e8', fontSize: '0.85rem', lineHeight: 1.7,
            filter: !lightOn ? 'blur(7px)' : 'none',
            transition: 'filter 0.5s ease',
            userSelect: !lightOn ? 'none' : 'auto',
          }}>
            {episode.question}
          </p>
          {!lightOn && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'rgba(245,200,66,0.5)', letterSpacing: '0.15em', textAlign: 'center' }}>
                🔦 find the light switch to reveal the question
              </span>
            </div>
          )}
          {phase === 'reading' && lightOn && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'rgba(245,200,66,0.5)', letterSpacing: '0.15em' }}>
                reading time... {graceLeft}s
              </span>
            </div>
          )}
        </div>

        {/* CORRECT MESSAGE */}
        <AnimatePresence>
          {phase === 'correct' && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mx-5 mb-4 px-4 py-3 text-center"
              style={{ background: `${level.color}18`, border: `1px solid ${level.color}66`, fontFamily: "'Special Elite', serif", color: level.color, fontSize: '0.95rem', textShadow: `0 0 10px ${level.color}66` }}>
              {correctMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* INPUT AREA */}
        {phase !== 'correct' && (
          <div className="px-5 pb-5">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: level.color, fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>›</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={phase !== 'active'}
                  placeholder={
                    phase === 'dark' ? 'waiting for light...' :
                    phase === 'reading' ? 'read the question...' :
                    phase === 'dead' ? 'no more chances...' :
                    `type your answer... (${lives} ${lives === 1 ? 'life' : 'lives'} left)`
                  }
                  autoComplete="off"
                  spellCheck={false}
                  style={{
                    flex: 1, background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${level.color}44`,
                    color: '#f5c842', fontFamily: 'JetBrains Mono', fontSize: '0.85rem',
                    outline: 'none', padding: '0.5rem 0.25rem',
                    opacity: phase === 'active' ? 1 : 0.35,
                    caretColor: '#f5c842', pointerEvents: 'auto', position: 'relative', zIndex: 100,
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" disabled={phase !== 'active' || !input.trim()}
                  className="haunted-btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.7rem', letterSpacing: '0.15em' }}>
                  [ SUBMIT ]
                </button>
                <button type="button" onClick={() => setShowHint(h => !h)}
                  disabled={phase === 'dark' || phase === 'reading'}
                  className="haunted-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', borderColor: '#3a2a1a', color: '#3a2a1a', opacity: phase === 'active' || phase === 'dead' ? 1 : 0.3 }}>
                  {showHint ? 'HIDE' : 'HINT'}
                </button>
              </div>
            </form>

            <AnimatePresence>
              {shake && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ marginTop: '0.5rem', textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#ff0033', letterSpacing: '0.1em' }}>
                  ✗ Wrong. {lives > 0 ? `${lives} ${lives === 1 ? 'life' : 'lives'} remaining — find the bulb again` : 'No lives left.'}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showHint && phase !== 'dark' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(139,0,0,0.05)', border: '1px solid #8b000033', fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8b4a4a', lineHeight: 1.6 }}>
                  💀 {episode.hint}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Morse visual */}
        {episode.puzzleType === 'morse' && phase === 'active' && (
          <div className="px-5 pb-4 flex items-center gap-1" style={{ opacity: 0.4 }}>
            {episode.question.split('').filter(c => ['·', '—', ' '].includes(c)).map((c, i) => (
              <span key={i} style={{ color: '#f5c842', fontSize: c === '—' ? '1.2rem' : '0.6rem', animation: `morse-flash ${0.5 + i * 0.1}s ease-in-out infinite alternate` }}>
                {c === ' ' ? '\u00A0' : c}
              </span>
            ))}
          </div>
        )}

        {/* Corner ornaments */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: level.color + '33' }}/>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: level.color + '33' }}/>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: level.color + '33' }}/>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: level.color + '33' }}/>
      </div>
    </motion.div>
  )
}

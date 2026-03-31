'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useLightContext, getBulbPosition } from '@/lib/lightContext'

interface Particle {
  id: number; x: number; y: number
  vx: number; vy: number; size: number
  opacity: number; shape: 'drop' | 'splat'
}

const BULB_RADIUS = 22

// Slider hidden at bottom-left corner — only torch reveals it
const SLIDER_X_PCT = 5
const SLIDER_Y_PCT = 90

export default function FlashlightCursor() {
  const [pos, setPos] = useState({ x: -999, y: -999 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [bulbPos, setBulbPos] = useState({ x: 0, y: 0 })
  const [sliderPos, setSliderPos] = useState({ x: 0, y: 0 })
  const [bulbNear, setBulbNear] = useState(false)
  const [sliderNear, setSliderNear] = useState(false)
  const particleId = useRef(0)
  const animRef = useRef<number | undefined>(undefined)

  const { lightOn, episodeId, torchRadius, turnOnLight, resetLight, setTorchRadius } = useLightContext()

  // Recalculate hidden positions on episode change / resize
  useEffect(() => {
    const update = () => {
      const pct = getBulbPosition(episodeId)
      setBulbPos({ x: window.innerWidth * pct.x / 100, y: window.innerHeight * pct.y / 100 })
      setSliderPos({ x: window.innerWidth * SLIDER_X_PCT / 100, y: window.innerHeight * SLIDER_Y_PCT / 100 })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [episodeId])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setBulbNear(Math.hypot(e.clientX - bulbPos.x, e.clientY - bulbPos.y) < torchRadius * 0.55)
      setSliderNear(Math.hypot(e.clientX - sliderPos.x, e.clientY - sliderPos.y) < torchRadius * 0.55)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [bulbPos, sliderPos, torchRadius])

  const spawnBlood = useCallback((x: number, y: number) => {
    const newP: Particle[] = Array.from({ length: 14 }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 6
      return {
        id: particleId.current++, x, y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2,
        size: 3 + Math.random() * 8, opacity: 0.9,
        shape: Math.random() > 0.4 ? 'drop' : 'splat',
      }
    })
    setParticles(prev => [...prev, ...newP])
    let frame = 0
    const animate = () => {
      frame++
      setParticles(prev => prev
        .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.35, vx: p.vx * 0.95, opacity: p.opacity - 0.025 }))
        .filter(p => p.opacity > 0))
      if (frame < 40) animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const click = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      // Never intercept form/button/input clicks
      if (t.tagName === 'INPUT' || t.tagName === 'BUTTON' || t.tagName === 'TEXTAREA' || t.closest('form') || t.closest('button')) return

      // Bulb click — toggle light (signals EpisodeCard timer start)
      if (Math.hypot(e.clientX - bulbPos.x, e.clientY - bulbPos.y) < BULB_RADIUS + 30) {
        lightOn ? resetLight() : turnOnLight()
        return
      }
      spawnBlood(e.clientX, e.clientY)
    }
    window.addEventListener('click', click)
    return () => { window.removeEventListener('click', click); if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [spawnBlood, bulbPos, lightOn, turnOnLight, resetLight])

  // When light is ON → overlay lifts (room lights up)
  // When light is OFF → torch-only darkness
  const overlayBg = lightOn
    ? 'rgba(2,2,5,0.08)'
    : `radial-gradient(circle ${torchRadius}px at ${pos.x}px ${pos.y}px,
        transparent 0%,
        rgba(2,2,5,0.6) 50%,
        rgba(2,2,5,1) 75%,
        rgba(2,2,5,1) 100%)`

  const intensityLabel = torchRadius <= 80 ? 'DIM' : torchRadius <= 160 ? 'NORMAL' : torchRadius <= 240 ? 'BRIGHT' : 'BLINDING'

  return (
    <>
      {/* ALWAYS-ON dark overlay — lifts when bulb is clicked */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9990,
        pointerEvents: 'none',
        background: overlayBg,
        transition: lightOn ? 'background 0.6s ease' : 'none',
      }} />

      {/* Warm glow ring around torch — subtle, inside the transparent zone */}
      <div style={{
        position: 'fixed', zIndex: 9991, pointerEvents: 'none',
        left: pos.x - torchRadius * 0.4,
        top: pos.y - torchRadius * 0.4,
        width: torchRadius * 0.8,
        height: torchRadius * 0.8,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,200,66,0.06) 0%, transparent 100%)',
      }} />

      {/* Hidden bulb — only visible when torch sweeps near it */}
      <div style={{
        position: 'fixed', zIndex: 9992,
        left: bulbPos.x - BULB_RADIUS, top: bulbPos.y - BULB_RADIUS,
        width: BULB_RADIUS * 2, height: BULB_RADIUS * 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem',
        opacity: bulbNear ? 1 : 0,
        transition: 'opacity 0.2s',
        filter: lightOn
          ? 'drop-shadow(0 0 14px rgba(245,200,66,1)) drop-shadow(0 0 28px rgba(245,200,66,0.6))'
          : 'drop-shadow(0 0 6px rgba(245,200,66,0.5))',
        pointerEvents: 'none',
      }}>
        {lightOn ? '💡' : '🔦'}
      </div>

      {/* Bulb tooltip — only when near and light is off */}
      {bulbNear && !lightOn && (
        <div style={{
          position: 'fixed', zIndex: 9993, pointerEvents: 'none',
          left: bulbPos.x + BULB_RADIUS + 8, top: bulbPos.y - 8,
          fontFamily: 'JetBrains Mono', fontSize: '0.6rem',
          color: 'rgba(245,200,66,0.8)', whiteSpace: 'nowrap', letterSpacing: '0.1em',
        }}>
          click to reveal question
        </div>
      )}

      {/* Hidden intensity slider — only visible when torch sweeps near bottom-left */}
      {sliderNear && (
        <div style={{
          position: 'fixed', zIndex: 9992,
          left: sliderPos.x - 55, top: sliderPos.y - 75,
          background: 'rgba(10,8,6,0.95)',
          border: '1px solid rgba(245,200,66,0.3)',
          borderRadius: 6,
          padding: '8px 12px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          pointerEvents: 'auto',
        }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.5rem', color: 'rgba(245,200,66,0.7)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
            🔦 {intensityLabel}
          </div>
          <input
            type="range" min={60} max={320} step={20} value={torchRadius}
            onChange={e => setTorchRadius(Number(e.target.value))}
            style={{ width: '90px', accentColor: '#f5c842', cursor: 'pointer' }}
          />
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.45rem', color: 'rgba(245,200,66,0.3)' }}>
            {torchRadius}px
          </div>
        </div>
      )}

      {/* Cursor crosshair — always on top */}
      <div style={{ position: 'fixed', zIndex: 9999, pointerEvents: 'none', left: pos.x - 8, top: pos.y - 8, width: 16, height: 16 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `1px solid ${bulbNear ? 'rgba(245,200,66,1)' : 'rgba(245,200,66,0.6)'}`,
          boxShadow: bulbNear ? '0 0 14px rgba(245,200,66,0.7)' : '0 0 8px rgba(245,200,66,0.3)',
        }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(245,200,66,0.4)', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(245,200,66,0.4)', transform: 'translateY(-50%)' }} />
      </div>

      {/* Blood splatter */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'fixed', zIndex: 15, pointerEvents: 'none',
          left: p.x - p.size / 2, top: p.y - p.size / 2,
          width: p.size, height: p.shape === 'drop' ? p.size * 1.5 : p.size,
          borderRadius: p.shape === 'drop' ? '50% 50% 50% 0' : '50%',
          background: `rgba(139, 0, 0, ${p.opacity})`,
          transform: `rotate(${(p.id * 37) % 360}deg)`,
        }} />
      ))}
    </>
  )
}

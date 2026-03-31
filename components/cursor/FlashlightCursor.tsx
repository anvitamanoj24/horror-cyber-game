'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useLightContext, getBulbPosition } from '@/lib/lightContext'

interface Particle {
  id: number; x: number; y: number
  vx: number; vy: number; size: number
  opacity: number; shape: 'drop' | 'splat'
}

const BULB_RADIUS = 20

export default function FlashlightCursor() {
  const [pos, setPos] = useState({ x: -500, y: -500 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [bulbPos, setBulbPos] = useState({ x: 0, y: 0 })
  const [bulbHovered, setBulbHovered] = useState(false)
  const [bulbFlicker, setBulbFlicker] = useState(false)
  const particleId = useRef(0)
  const animRef = useRef<number | undefined>(undefined)

  const { lightOn, episodeId, torchRadius, turnOnLight, resetLight, setTorchRadius } = useLightContext()

  useEffect(() => {
    const update = () => {
      const pct = getBulbPosition(episodeId)
      setBulbPos({ x: window.innerWidth * pct.x / 100, y: window.innerHeight * pct.y / 100 })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [episodeId])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setBulbHovered(Math.hypot(e.clientX - bulbPos.x, e.clientY - bulbPos.y) < BULB_RADIUS + 28)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [bulbPos])

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
      if (t.tagName === 'INPUT' || t.tagName === 'BUTTON' || t.tagName === 'TEXTAREA' || t.closest('form') || t.closest('button')) return
      if (Math.hypot(e.clientX - bulbPos.x, e.clientY - bulbPos.y) < BULB_RADIUS + 28) {
        setBulbFlicker(true)
        setTimeout(() => { lightOn ? resetLight() : turnOnLight(); setBulbFlicker(false) }, 150)
        return
      }
      spawnBlood(e.clientX, e.clientY)
    }
    window.addEventListener('click', click)
    return () => { window.removeEventListener('click', click); if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [spawnBlood, bulbPos, lightOn, turnOnLight, resetLight])

  const intensityLabel = torchRadius <= 80 ? 'DIM' : torchRadius <= 160 ? 'NORMAL' : torchRadius <= 240 ? 'BRIGHT' : 'BLINDING'

  const overlayBg = lightOn
    ? (bulbFlicker ? 'rgba(2,2,5,0.7)' : 'rgba(2,2,5,0.08)')
    : `radial-gradient(circle ${torchRadius}px at ${pos.x}px ${pos.y}px,
        rgba(245,200,66,0.07) 0%,
        rgba(245,200,66,0.03) 35%,
        rgba(2,2,5,0.9) 65%,
        rgba(2,2,5,0.98) 100%)`

  return (
    <>
      {/* Full-screen dark overlay — torch punches a hole in it */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none', background: overlayBg, transition: lightOn ? 'background 0.5s ease' : 'none' }} />

      {/* Warm inner glow ring */}
      {!lightOn && (
        <div style={{
          position: 'fixed', zIndex: 11, pointerEvents: 'none',
          left: pos.x - torchRadius * 0.5, top: pos.y - torchRadius * 0.5,
          width: torchRadius, height: torchRadius, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)',
        }} />
      )}

      {/* Hidden bulb — only appears when torch is near OR light is on */}
      <div style={{
        position: 'fixed', zIndex: 20,
        left: bulbPos.x - BULB_RADIUS, top: bulbPos.y - BULB_RADIUS,
        width: BULB_RADIUS * 2, height: BULB_RADIUS * 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem',
        opacity: lightOn ? 1 : bulbHovered ? 1 : 0,
        transition: 'opacity 0.2s',
        filter: lightOn
          ? 'drop-shadow(0 0 14px rgba(245,200,66,1)) drop-shadow(0 0 30px rgba(245,200,66,0.5))'
          : 'drop-shadow(0 0 6px rgba(245,200,66,0.6))',
        pointerEvents: 'none',
      }}>
        {lightOn ? '💡' : '🔦'}
      </div>

      {/* Bulb tooltip */}
      {bulbHovered && !lightOn && (
        <div style={{
          position: 'fixed', zIndex: 21, pointerEvents: 'none',
          left: bulbPos.x + BULB_RADIUS + 10, top: bulbPos.y - 8,
          fontFamily: 'JetBrains Mono', fontSize: '0.6rem',
          color: 'rgba(245,200,66,0.8)', whiteSpace: 'nowrap', letterSpacing: '0.1em',
        }}>
          click to light the room
        </div>
      )}

      {/* Intensity slider — always visible, above overlay */}
      <div style={{
        position: 'fixed', zIndex: 9998, bottom: 16, left: 16,
        background: 'rgba(10,8,6,0.92)',
        border: '1px solid rgba(245,200,66,0.3)',
        borderRadius: 6,
        padding: '6px 12px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
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

      {/* Cursor crosshair */}
      <div style={{ position: 'fixed', zIndex: 9999, pointerEvents: 'none', left: pos.x - 8, top: pos.y - 8, width: 16, height: 16 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `1px solid ${bulbHovered ? 'rgba(245,200,66,1)' : 'rgba(245,200,66,0.6)'}`,
          boxShadow: bulbHovered ? '0 0 14px rgba(245,200,66,0.7)' : '0 0 8px rgba(245,200,66,0.3)',
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

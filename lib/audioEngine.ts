// Audio Engine — Victorian Horror Soundscape
// All sounds generated via Web Audio API (no external files needed)

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)()
  } catch { return null }
}

function osc(ctx: AudioContext, freq: number, type: OscillatorType, duration: number, gain: number, startDelay = 0) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, ctx.currentTime + startDelay)
  g.gain.setValueAtTime(gain, ctx.currentTime + startDelay)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration)
  o.connect(g)
  g.connect(ctx.destination)
  o.start(ctx.currentTime + startDelay)
  o.stop(ctx.currentTime + startDelay + duration)
}

function noise(ctx: AudioContext, duration: number, gain: number) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  src.connect(g)
  g.connect(ctx.destination)
  src.start()
}

let ambientCtx: AudioContext | null = null

export const AudioEngine = {
  startAmbience() {
    if (typeof window === 'undefined' || ambientCtx) return
    try {
      ambientCtx = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Low electrical hum — 60Hz
      const hum = ambientCtx.createOscillator()
      const humGain = ambientCtx.createGain()
      hum.type = 'sawtooth'
      hum.frequency.value = 60
      humGain.gain.value = 0.03
      hum.connect(humGain)
      humGain.connect(ambientCtx.destination)
      hum.start()

      // Distant heartbeat
      const beat = () => {
        if (!ambientCtx) return
        const o = ambientCtx.createOscillator()
        const g = ambientCtx.createGain()
        o.type = 'sine'
        o.frequency.value = 35
        g.gain.setValueAtTime(0.4, ambientCtx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ambientCtx.currentTime + 0.25)
        o.connect(g)
        g.connect(ambientCtx.destination)
        o.start(ambientCtx.currentTime)
        o.stop(ambientCtx.currentTime + 0.25)
        setTimeout(beat, 1200 + Math.random() * 200)
      }
      setTimeout(beat, 800)

      // Occasional creak
      const creak = () => {
        if (!ambientCtx) return
        const o = ambientCtx.createOscillator()
        const g = ambientCtx.createGain()
        o.type = 'sawtooth'
        o.frequency.setValueAtTime(200 + Math.random() * 100, ambientCtx.currentTime)
        o.frequency.exponentialRampToValueAtTime(80, ambientCtx.currentTime + 0.8)
        g.gain.setValueAtTime(0.06, ambientCtx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ambientCtx.currentTime + 0.8)
        o.connect(g)
        g.connect(ambientCtx.destination)
        o.start(ambientCtx.currentTime)
        o.stop(ambientCtx.currentTime + 0.8)
        setTimeout(creak, 8000 + Math.random() * 12000)
      }
      setTimeout(creak, 3000)
    } catch (_) {}
  },

  stopAmbience() {
    try { ambientCtx?.close(); ambientCtx = null } catch (_) {}
  },

  playCorrect() {
    const ctx = getCtx()
    if (!ctx) return
    // Satisfying unlock click + rising tone
    osc(ctx, 300, 'sine', 0.08, 0.3)
    osc(ctx, 600, 'sine', 0.15, 0.25, 0.05)
    osc(ctx, 900, 'sine', 0.2, 0.2, 0.1)
  },

  playIncorrect() {
    const ctx = getCtx()
    if (!ctx) return
    // Heavy door slam + static
    osc(ctx, 80, 'sawtooth', 0.5, 0.6)
    osc(ctx, 40, 'sine', 0.8, 0.5)
    noise(ctx, 0.6, 0.2)
  },

  playTyping() {
    const ctx = getCtx()
    if (!ctx) return
    // Typewriter key click
    osc(ctx, 800 + Math.random() * 300, 'square', 0.03, 0.12)
  },

  playMelt() {
    const ctx = getCtx()
    if (!ctx) return
    try {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sawtooth'
      o.frequency.setValueAtTime(300, ctx.currentTime)
      o.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 3)
      g.gain.setValueAtTime(0.4, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5)
      o.connect(g)
      g.connect(ctx.destination)
      o.start()
      o.stop(ctx.currentTime + 3.5)
      noise(ctx, 3, 0.25)
    } catch (_) {}
  },
}

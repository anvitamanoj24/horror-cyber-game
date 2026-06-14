// Horror Audio Engine — Web Audio API
// 1. Background: smooth horror drone (no heartbeat/hum)
// 2. Door creak: ungreased hinge sound on level entry
// 3. Correct: subtle chime
// 4. Incorrect: low thud + static
// 5. Melt: descending horror tone

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)()
  } catch { return null }
}

// ── Ambient horror drone ──────────────────────────────────────────
let ambientCtx: AudioContext | null = null

export const AudioEngine = {
  startAmbience() {
    if (typeof window === 'undefined' || ambientCtx) return
    try {
      ambientCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const ctx = ambientCtx

      // Deep horror drone — two slightly detuned oscillators creating a beating/unsettling effect
      const makeHorrorDrone = (freq: number, detune: number, gain: number) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 400
        osc.type = 'sawtooth'
        osc.frequency.value = freq
        osc.detune.value = detune
        g.gain.value = gain
        osc.connect(filter)
        filter.connect(g)
        g.connect(ctx.destination)
        osc.start()
        return { osc, g }
      }

      makeHorrorDrone(55, 0, 0.025)    // Low A — deep rumble
      makeHorrorDrone(55, 7, 0.018)    // Slightly detuned — creates beating
      makeHorrorDrone(82.5, 0, 0.015)  // E — haunting fifth
      makeHorrorDrone(110, -5, 0.012)  // A octave up — very subtle

      // Slowly modulating reverb-like effect with delay
      const delay = ctx.createDelay(2)
      const delayGain = ctx.createGain()
      delay.delayTime.value = 1.2
      delayGain.gain.value = 0.15
      // create a looping noise pad
      const bufSize = ctx.sampleRate * 4
      const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const data = noiseBuf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.003 // very quiet noise texture
      }
      const noiseNode = ctx.createBufferSource()
      noiseNode.buffer = noiseBuf
      noiseNode.loop = true
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'bandpass'
      noiseFilter.frequency.value = 200
      noiseFilter.Q.value = 0.5
      const noiseGain = ctx.createGain()
      noiseGain.gain.value = 0.08
      noiseNode.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noiseNode.start()

      // Occasional low creepy tone swell
      const swell = () => {
        if (!ambientCtx) return
        const o = ambientCtx.createOscillator()
        const g = ambientCtx.createGain()
        const f = ambientCtx.createBiquadFilter()
        f.type = 'lowpass'
        f.frequency.value = 300
        o.type = 'sine'
        o.frequency.setValueAtTime(40 + Math.random() * 30, ambientCtx.currentTime)
        o.frequency.linearRampToValueAtTime(20, ambientCtx.currentTime + 4)
        g.gain.setValueAtTime(0, ambientCtx.currentTime)
        g.gain.linearRampToValueAtTime(0.07, ambientCtx.currentTime + 1.5)
        g.gain.linearRampToValueAtTime(0, ambientCtx.currentTime + 4)
        o.connect(f); f.connect(g); g.connect(ambientCtx.destination)
        o.start(ambientCtx.currentTime)
        o.stop(ambientCtx.currentTime + 4)
        setTimeout(swell, 8000 + Math.random() * 12000)
      }
      setTimeout(swell, 4000)

    } catch (_) {}
  },

  stopAmbience() {
    try { ambientCtx?.close(); ambientCtx = null } catch (_) {}
  },

  // ── Door creak — plays dooropening.mp3 ──────────────────────
  playDoorCreak() {
    if (typeof window === 'undefined') return
    try {
      const audio = new Audio('/dooropening.mp3')
      audio.volume = 0.85
      audio.play().catch(() => {})
    } catch (_) {}
  },

  // ── Entry page sound — plays entrypage.wav ───────────────────
  playEntryPage() {
    if (typeof window === 'undefined') return
    try {
      const audio = new Audio('/entrypage.wav')
      audio.volume = 0.7
      audio.loop = true
      audio.play().catch(() => {})
      // Store reference so we can stop it later
      ;(window as any).__entryAudio = audio
    } catch (_) {}
  },

  stopEntryPage() {
    if (typeof window === 'undefined') return
    try {
      const audio = (window as any).__entryAudio
      if (audio) { audio.pause(); audio.currentTime = 0; (window as any).__entryAudio = null }
    } catch (_) {}
  },

  // ── 3 attempts failed sound — plays after3attempts.wav ───────
  play3Attempts(onEnd?: () => void) {
    if (typeof window === 'undefined') return
    try {
      const audio = new Audio('/after3attempts.wav')
      audio.volume = 0.9
      if (onEnd) audio.onended = onEnd
      audio.play().catch(() => { onEnd?.() })
    } catch (_) { onEnd?.() }
  },
  playCorrect() {
    const ctx = getCtx()
    if (!ctx) return
    try {
      // Subtle eerie chime — not too happy, fitting the horror tone
      ;[523, 659, 784].forEach((freq, i) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'
        o.frequency.value = freq
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.1)
        g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.1 + 0.02)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.8)
        o.connect(g); g.connect(ctx.destination)
        o.start(ctx.currentTime + i * 0.1)
        o.stop(ctx.currentTime + i * 0.1 + 0.9)
      })
    } catch (_) {}
  },

  // ── Incorrect / timeout ──────────────────────────────────────
  playIncorrect() {
    const ctx = getCtx()
    if (!ctx) return
    try {
      // Heavy thud
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sawtooth'
      o.frequency.setValueAtTime(80, ctx.currentTime)
      o.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.6)
      g.gain.setValueAtTime(0.5, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7)
      o.connect(g); g.connect(ctx.destination)
      o.start(); o.stop(ctx.currentTime + 0.8)
      // Static burst
      const bufSize = ctx.sampleRate * 0.4
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1
      const src = ctx.createBufferSource()
      src.buffer = buf
      const ng = ctx.createGain()
      ng.gain.setValueAtTime(0.2, ctx.currentTime)
      ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      src.connect(ng); ng.connect(ctx.destination)
      src.start()
    } catch (_) {}
  },

  // Typing click — silent now (removed per request)
  playTyping() {},

  // ── System melt ──────────────────────────────────────────────
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
      o.connect(g); g.connect(ctx.destination)
      o.start(); o.stop(ctx.currentTime + 3.5)
      // Noise
      const bufSize = ctx.sampleRate * 3
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1
      const src = ctx.createBufferSource()
      src.buffer = buf
      const ng = ctx.createGain()
      ng.gain.setValueAtTime(0.25, ctx.currentTime)
      ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3)
      src.connect(ng); ng.connect(ctx.destination)
      src.start()
    } catch (_) {}
  },
}

'use client'
import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { LEVELS } from '@/data/episodes'
import { Permadeath } from '@/lib/permadeath'
import { AudioEngine } from '@/lib/audioEngine'
import EpisodeCard from '@/components/game/EpisodeCard'
import MasterRiddle from '@/components/game/MasterRiddle'
import LevelMap from '@/components/game/LevelMap'
import LevelSelect from '@/components/game/LevelSelect'
import LevelBrief from '@/components/game/LevelBrief'
import SystemMelt from '@/components/game/SystemMelt'
import LockedScreen from '@/components/game/LockedScreen'
import InnovationPortal from '@/components/portal/InnovationPortal'
import IntroScreen from '@/components/game/IntroScreen'

export default function GameOrchestrator() {
  const {
    phase,
    currentLevel,
    currentEpisode,
    completedEpisodes,
    fragments,
    lockedAt,
    masterRiddleActive,
    startGame,
    selectLevel,
    enterLevel,
    advanceEpisode,
    solveMasterRiddle,
    triggerMelt,
    collectFragment,
  } = useGameStore()

  useEffect(() => {
    // TESTING MODE — skip permadeath check
    // if (Permadeath.isLocked()) {
    //   useGameStore.setState({ phase: 'locked', lockedAt: Permadeath.getLockedAt() })
    // }
  }, [])

  useEffect(() => {
    if (phase === 'playing') AudioEngine.startAmbience()
    if (phase === 'locked' || phase === 'melt') AudioEngine.stopAmbience()
    if (phase === 'levelSelect' || phase === 'levelBrief') AudioEngine.stopAmbience()
  }, [phase])

  useEffect(() => {
    if (phase === 'locked') Permadeath.lock()
  }, [phase])

  // Full-screen phases
  if (phase === 'locked') return <LockedScreen lockedAt={lockedAt} />
  if (phase === 'melt') return <SystemMelt />
  if (phase === 'portal') return <InnovationPortal />
  if (phase === 'intro') return <IntroScreen onStart={startGame} />
  if (phase === 'levelSelect') return (
    <LevelSelect
      fragments={fragments}
      completedEpisodes={completedEpisodes}
      onSelect={selectLevel}
    />
  )
  if (phase === 'levelBrief') return (
    <LevelBrief
      levelId={currentLevel}
      onEnter={enterLevel}
      onBack={() => useGameStore.setState({ phase: 'levelSelect' })}
    />
  )

  // Playing phase
  const level = LEVELS[currentLevel - 1]
  const episode = level.episodes[currentEpisode - 1]

  const handleMasterSolve = () => {
    collectFragment(level.fragment)
    solveMasterRiddle()
  }

  return (
    <div className="min-h-screen flex relative" style={{ background: '#020205' }}>
      {/* Hallway perspective */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }} preserveAspectRatio="none">
        <line x1="50%" y1="0" x2="5%"  y2="100%" stroke="#3a2a1a" strokeWidth="1"/>
        <line x1="50%" y1="0" x2="95%" y2="100%" stroke="#3a2a1a" strokeWidth="1"/>
        <line x1="50%" y1="0" x2="20%" y2="100%" stroke="#3a2a1a" strokeWidth="0.5"/>
        <line x1="50%" y1="0" x2="80%" y2="100%" stroke="#3a2a1a" strokeWidth="0.5"/>
        {[15,30,45,60,75,90].map(y => (
          <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#3a2a1a" strokeWidth="0.5"/>
        ))}
      </svg>

      {/* Left sidebar */}
      <div
        className="w-52 flex-shrink-0 flex flex-col p-4 border-r relative"
        style={{ borderColor: '#1a1208', background: 'rgba(10,8,6,0.8)', zIndex: 45 }}
      >
        <div className="text-center mb-4">
          <div className="float inline-block text-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(245,200,66,0.5))' }}>
            🏮
          </div>
        </div>

        <LevelMap currentLevel={currentLevel} currentEpisode={currentEpisode} fragments={fragments} />

        {fragments.length > 0 && (
          <div className="mt-auto pt-4 border-t" style={{ borderColor: '#1a1208' }}>
            <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.55rem', marginBottom: '0.5rem', letterSpacing: '0.15em' }}>
              COLLECTED FRAGMENTS
            </div>
            {fragments.map((f, i) => (
              <div key={i} style={{ fontFamily: 'JetBrains Mono', color: '#8b4a4a', fontSize: '0.6rem', marginBottom: '0.25rem' }}>
                ◈ {f}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col relative" style={{ zIndex: 45 }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-3 border-b" style={{ borderColor: '#1a1208', background: 'rgba(10,8,6,0.6)' }}>
          <div style={{ fontFamily: "'Special Elite', serif", color: '#8b6a4a', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
            THE HAUNTED CURRICULUM
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
            {completedEpisodes}/40 ROOMS CLEARED
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', color: level.color + '88', fontSize: '0.65rem' }}>
            {level.theme}
          </div>
        </div>

        {/* Episode / Riddle */}
        <div className="flex-1 flex items-center justify-center p-8">
          {masterRiddleActive ? (
            <MasterRiddle level={level} onSolve={handleMasterSolve} onFail={triggerMelt} />
          ) : (
            <EpisodeCard key={episode.id} episode={episode} onCorrect={advanceEpisode} onFail={triggerMelt} />
          )}
        </div>

        {/* Bottom bar */}
        <div className="px-8 py-2 border-t flex items-center" style={{ borderColor: '#1a1208', background: 'rgba(10,8,6,0.6)' }}>
          <div style={{ fontFamily: 'JetBrains Mono', color: '#3a2a1a', fontSize: '0.6rem' }}>
            KTU ELECTRONICS DESIGN CHALLENGE
          </div>
          <div className="ml-auto" style={{ fontFamily: 'JetBrains Mono', color: '#8b000044', fontSize: '0.6rem' }}>
            PERMADEATH ACTIVE · TAB SWITCH = INSTANT FAIL
          </div>
        </div>
      </div>

      {/* CRT scanlines */}
      <div className="fixed inset-0 pointer-events-none z-10" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 6px)',
      }}/>
    </div>
  )
}

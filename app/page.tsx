'use client'
import dynamic from 'next/dynamic'
import { LightProvider } from '@/lib/lightContext'

const FlashlightCursor = dynamic(() => import('@/components/cursor/FlashlightCursor'), { ssr: false })
const GameOrchestrator = dynamic(() => import('@/components/game/GameOrchestrator'), { ssr: false })

export default function Home() {
  return (
    <LightProvider>
      <main style={{ background: '#020205', minHeight: '100vh' }}>
        <FlashlightCursor />
        <GameOrchestrator />
      </main>
    </LightProvider>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HORROR-CYBER MATRIX',
  description: 'A gamified horror-cyber quiz. 40 episodes. One chance.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#050505', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}

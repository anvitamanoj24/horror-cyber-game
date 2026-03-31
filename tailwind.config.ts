import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pcb-bg': '#050505',
        'neon-green': '#00ff41',
        'neon-red': '#ff0033',
        'neon-blue': '#00d4ff',
        'dim-green': '#003b0f',
      },
      fontFamily: {
        mono: ['Share Tech Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config

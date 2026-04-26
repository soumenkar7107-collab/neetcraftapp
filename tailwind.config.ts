import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          red: '#ff2d55',
          blue: '#0a84ff',
          cyan: '#00d4ff',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 5px #ff2d55, 0 0 10px #ff2d55' },
          to: { boxShadow: '0 0 20px #ff2d55, 0 0 40px #ff2d55' },
        }
      }
    },
  },
  plugins: [],
}
export default config

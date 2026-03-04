/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#1A1C30', // Panel
          950: '#121421', // Background
        },
        unkind: {
          cyan: '#00E5FF',
          red: '#FF4D4D',
          gold: '#FFD700',
          green: '#87FF65',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow-slow': 'glow 4s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.5)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 0.8 },
        }
      }
    },
  },
  plugins: [],
}


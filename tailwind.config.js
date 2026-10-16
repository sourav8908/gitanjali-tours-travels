/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./admin/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B1F33',
          'navy-light': '#142E4B',
          'navy-dark': '#061320',
          ocean: '#176B87',
          'ocean-hover': '#115369',
          'ocean-light': '#EEF7F9',
          gold: '#D6A756',
          'gold-light': '#FDF8EC',
          'gold-dark': '#B88B38',
          surface: '#F5F7FA',
          'surface-card': '#FFFFFF',
          text: '#17202A',
          muted: '#5A6A7E',
          border: '#E2E8F0',
          // Odisha accents: Konark sandstone and a warm temple-ivory surface
          sandstone: '#A85A32',
          ivory: '#FBF7F0',
        }
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        kenBurns: {
          from: { transform: 'scale(1.0)' },
          to: { transform: 'scale(1.08)' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        kenBurns: 'kenBurns 7s ease-out both',
        spinSlow: 'spinSlow 90s linear infinite',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(11, 31, 51, 0.04)',
        'card': '0 4px 20px rgba(11, 31, 51, 0.06)',
        'hover': '0 8px 30px rgba(11, 31, 51, 0.10)',
        'dropdown': '0 10px 25px rgba(11, 31, 51, 0.12)',
      },
      borderRadius: {
        'brand': '8px',
        'brand-lg': '12px',
      }
    },
  },
  plugins: [],
}

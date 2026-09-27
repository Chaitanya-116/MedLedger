/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: '#root',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E',
          hover: '#115E59',
          light: '#14B8A6',
          dark: '#0F524C',
        },
        secondary: {
          DEFAULT: '#2563EB',
          light: '#60A5FA',
          dark: '#1D4ED8',
        },
        success: '#22C55E',
        warning: '#FBBF24',
        danger: '#EF4444',
        purple: '#8B5CF6',
        orange: '#FB923C',
        text: {
          primary: '#17313B',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.28)',
          border: 'rgba(255, 255, 255, 0.38)',
          hover: 'rgba(255, 255, 255, 0.45)',
        }
      },
      borderRadius: {
        'app': '28px',
        'card': '24px',
        'button': '18px',
        'input': '18px',
        'table': '24px',
        'dialog': '28px',
        'sidebar': '30px',
      },
      boxShadow: {
        'glass': '0 10px 30px rgba(15, 118, 110, 0.08)',
        'glass-hover': '0 15px 35px rgba(15, 118, 110, 0.12)',
        'glow-emerald': '0 0 20px rgba(15, 118, 110, 0.3)',
      },
      backdropBlur: {
        'glass': '24px',
      }
    },
  },
  plugins: [],
}


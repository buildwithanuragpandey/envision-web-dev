/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        charcoal: '#0D0D0F',
        surface: {
          DEFAULT: '#141416',
          50: '#F5F2EA',
          100: '#E6E4DC',
          200: '#2A2A2E',
          700: '#1C1C20',
          800: '#141416',
          900: '#0D0D0F',
          950: '#050505',
        },
        brand: {
          DEFAULT: '#FF6A16',
          orange: '#FF6A16',
          amber: '#FF9D00',
          yellow: '#FFD400',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FF8540',
          500: '#FF6A16',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        accent: {
          amber: '#FF9D00',
          yellow: '#FFD400',
          500: '#FFD400',
        },
        warm: '#F5F2EA',
        muted: '#8C8A84',
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          subtle: 'rgba(255, 255, 255, 0.05)',
          glow: 'rgba(255, 106, 22, 0.4)',
        },
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.6)',
        'premium': '0 8px 30px -4px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.06)',
        'glow-orange': '0 0 25px rgba(255, 106, 22, 0.25)',
        'glow-amber': '0 0 25px rgba(255, 157, 0, 0.2)',
        'glow-yellow': '0 0 25px rgba(255, 212, 0, 0.2)',
        'dropdown': '0 20px 40px -4px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
        'marquee-fast': 'marquee 22s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'travel-border': 'travelBorder 6s linear infinite',
        'slow-pan': 'slowPan 18s ease-in-out infinite alternate',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        slowPan: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.04) translate(-1%, -1%)' },
        },
      },
    },
  },
  plugins: [],
}

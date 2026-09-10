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
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#ff8540',
          500: '#FF6814', // Primary Brand Orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        accent: {
          300: '#fff080',
          400: '#ffe640',
          500: '#FFDD00', // Primary Brand Yellow
          600: '#e6c700',
          700: '#bfa500',
        },
        surface: {
          50: '#fbfbfb',
          100: '#f4f4f5',
          200: '#27272a',
          700: '#16161a',
          800: '#111114', // Muted dark surface
          900: '#0A0A0C', // Secondary dark surface
          950: '#030304', // Main background
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          subtle: 'rgba(255, 255, 255, 0.05)',
          hover: 'rgba(255, 104, 20, 0.28)',
          glow: 'rgba(255, 221, 0, 0.3)',
        },
        text: {
          primary: '#F5F5F0',
          secondary: '#A1A1A1',
          muted: '#686868',
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
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'glow-orange': '0 0 30px rgba(255, 104, 20, 0.14)',
        'glow-yellow': '0 0 25px rgba(255, 221, 0, 0.12)',
        'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.06)',
        'dropdown': '0 16px 40px -4px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        'marquee-fast': 'marquee 20s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
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
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}

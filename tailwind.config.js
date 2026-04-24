/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#080812',
          800: '#0d0d1a',
          700: '#11111f',
          600: '#161628',
          500: '#1c1c30',
          400: '#252540',
          300: '#2e2e50',
        },
        brand: {
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          blue: '#3b82f6',
        }
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(139,92,246,0.1) 100%)',
      },
    },
  },
  plugins: [],
}

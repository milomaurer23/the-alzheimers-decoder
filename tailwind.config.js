/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        obsidian: '#0D0D0D',
        ash: {
          50: '#FAFAFA',
          100: '#F5F5F3',
          200: '#E8E8E5',
          300: '#D1D1CC',
          400: '#A3A39C',
          500: '#787870',
        },
        crimson: {
          DEFAULT: '#9B1B1B',
          light: '#C41E3A',
          pale: '#F5E8E8',
          muted: '#D4896A',
        },
      },
      letterSpacing: {
        ultrawide: '0.3em',
      },
      gridTemplateColumns: {
        'ledger': '1fr 420px',
      },
    },
  },
  plugins: [],
}

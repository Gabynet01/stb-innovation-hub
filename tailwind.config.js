/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Modern Elegant Blue Color Scheme
        'primary': {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#C1DFFF',
          300: '#A2CFFF',
          400: '#83BFFF',
          500: '#0062E1', // Main brand color
          600: '#0058C8',
          700: '#004EAF',
          800: '#004496',
          900: '#003A7D',
        },
        'accent': {
          50: '#FFF7F0',
          100: '#FFEFE0',
          200: '#FFDFC1',
          300: '#FFCFA2',
          400: '#FFBF83',
          500: '#FF9F44', // Warm accent color
          600: '#FF8F2B',
          700: '#FF7F12',
          800: '#FF6F00',
          900: '#E65F00',
        },
        // Sophisticated grays
        'neutral': {
          50: '#FAFBFC',
          100: '#F5F7FA',
          200: '#EFF2F7',
          300: '#E2E8F0',
          400: '#CBD5E1',
          500: '#94A3B8',
          600: '#64748B',
          700: '#475569',
          800: '#334155',
          900: '#1E293B',
        }
      },
      fontFamily: {
        'sans': ['Outfit'],
        'display': ['Outfit'],
        'stanbic': ['Outfit'],
      }
    },
  },
  plugins: [],
}


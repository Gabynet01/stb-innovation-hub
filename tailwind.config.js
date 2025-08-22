/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Standard Bank Brand Colors (Updated - Electric Blue Primary)
        'standard-bank': {
          50: '#F0F7FF',   // Very light blue tint
          100: '#E0EFFF',  // Light blue tint
          200: '#C1DFFF',  // Light blue
          300: '#A2CFFF',  // Medium light blue
          400: '#83BFFF',  // Medium blue
          500: '#50BEFF',  // Sky Blue
          600: '#0051FF',  // Electric Blue (Primary)
          700: '#0033A1',  // Standard Bank Blue
          800: '#00008C',  // Deep Blue
          900: '#000032',  // Stature Blue
        },
        // Primary brand colors for easy access (Electric Blue Primary)
        'primary': {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#C1DFFF',
          300: '#A2CFFF',
          400: '#83BFFF',
          500: '#50BEFF',  // Sky Blue
          600: '#0051FF',  // Electric Blue (Main brand color)
          700: '#0033A1',  // Standard Bank Blue
          800: '#00008C',  // Deep Blue
          900: '#000032',  // Stature Blue
        },
        // Accent colors using the blue palette
        'accent': {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#C1DFFF',
          300: '#A2CFFF',
          400: '#83BFFF',
          500: '#50BEFF',  // Sky Blue as accent
          600: '#0051FF',  // Electric Blue as primary
          700: '#0033A1',  // Standard Bank Blue
          800: '#00008C',  // Deep Blue
          900: '#000032',  // Stature Blue
        },
        // Corporate/Secondary Colors
        'corporate': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',  // Corporate gray
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
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
        'sans': ['Benton Sans Pro', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'display': ['Benton Sans Pro', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'brand': ['Benton Sans Pro', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontWeight: {
        'benton-thin': '100',
        'benton-extralight': '200',
        'benton-light': '300',
        'benton-normal': '400',
        'benton-medium': '500',
        'benton-semibold': '600',
        'benton-bold': '700',
        'benton-extrabold': '800',
        'benton-black': '900',
        'inter-thin': '100',
        'inter-extralight': '200',
        'inter-light': '300',
        'inter-normal': '400',
        'inter-medium': '500',
        'inter-semibold': '600',
        'inter-bold': '700',
        'inter-extrabold': '800',
        'inter-black': '900',
      }
    },
  },
  plugins: [],
}


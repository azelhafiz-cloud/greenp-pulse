/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Forest greens
        forest: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Sage
        sage: {
          50:  '#f6f8f5',
          100: '#e8ede5',
          200: '#d2dccb',
          300: '#b0c2a4',
          400: '#86a278',
          500: '#668558',
          600: '#4f6944',
          700: '#3e5234',
          800: '#33422b',
          900: '#2a3724',
        },
        // Mint
        mint: {
          50:  '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Cream
        cream: {
          50:  '#fefdf8',
          100: '#fdf9ec',
          200: '#faf2d4',
          300: '#f5e5a8',
          400: '#edd577',
          500: '#e3c04d',
        },
        // Dark mode backgrounds
        dark: {
          bg:      '#0d1f13',
          surface: '#152419',
          card:    '#1a2e1f',
          border:  '#243d2a',
          muted:   '#2e4d35',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'green-sm': '0 2px 8px 0 rgba(22, 163, 74, 0.12)',
        'green-md': '0 4px 16px 0 rgba(22, 163, 74, 0.18)',
        'green-lg': '0 8px 32px 0 rgba(22, 163, 74, 0.22)',
        'soft':     '0 2px 16px 0 rgba(0,0,0,0.06)',
        'soft-md':  '0 4px 24px 0 rgba(0,0,0,0.10)',
      },
      backgroundImage: {
        'leaf-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q45 15 50 30 Q45 45 30 55 Q15 45 10 30 Q15 15 30 5Z' fill='none' stroke='%2322c55e' stroke-width='0.5' opacity='0.15'/%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-green': 'pulse-green 2s ease-in-out infinite',
        'grow': 'grow 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'bounce-gentle': 'bounceGentle 1s ease-in-out infinite',
        'leaf-sway': 'leafSway 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.4)' },
          '50%':       { boxShadow: '0 0 0 12px rgba(34,197,94,0)' },
        },
        grow: {
          '0%':   { transform: 'scaleY(0)', opacity: '0' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-4px)' },
        },
        leafSway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%':       { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
};

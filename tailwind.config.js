/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A3A52',
          50: '#EAF0F4',
          100: '#CBDBE4',
          200: '#9FBCCC',
          300: '#6D97AF',
          400: '#436F8C',
          500: '#274F6C',
          600: '#1A3A52',
          700: '#152F42',
          800: '#102432',
          900: '#0A1822',
          950: '#060F16',
        },
        teal: {
          DEFAULT: '#2D9B8F',
          50: '#E9F7F5',
          100: '#C7ECE8',
          200: '#9BDDD5',
          300: '#6BCBC0',
          400: '#45B7AA',
          500: '#2D9B8F',
          600: '#237C73',
          700: '#1C6259',
          800: '#154843',
          900: '#0E312E',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FBF6E7',
          100: '#F5E8C2',
          200: '#EDD590',
          300: '#E4C15E',
          400: '#DABB3F',
          500: '#D4AF37',
          600: '#AB8A26',
          700: '#82691D',
          800: '#584713',
          900: '#39300C',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Sora"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(26, 58, 82, 0.12)',
        card: '0 2px 12px -2px rgba(26, 58, 82, 0.10)',
        'card-hover': '0 12px 32px -8px rgba(26, 58, 82, 0.22)',
        glow: '0 0 0 4px rgba(45, 155, 143, 0.15)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-out infinite',
        marquee: 'marquee 28s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}

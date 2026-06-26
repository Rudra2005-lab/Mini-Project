/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F6F1E8',
          surface: '#FFFDF8',
          card: '#FFFFFF',
          border: '#D7D2C5',
          teal: '#0F766E',
          violet: '#7C3AED',
          indigo: '#2563EB',
          text: '#162033',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(15, 118, 110, 0.08), 0 18px 50px rgba(148, 163, 184, 0.22)',
        teal: '0 18px 44px rgba(15, 118, 110, 0.16)',
      },
      animation: {
        blob: 'blob 7s infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 7s ease-in-out infinite',
        pulseSoft: 'pulseSoft 3s ease-in-out infinite',
      },
      backgroundImage: {
        mesh:
          'radial-gradient(circle at 20% 20%, rgba(15, 118, 110, 0.14), transparent 30%), radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.14), transparent 26%), radial-gradient(circle at 55% 75%, rgba(37, 99, 235, 0.18), transparent 28%)',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.08)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.92)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
};

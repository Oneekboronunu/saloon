/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF8F0',
          100: '#F6EFDC',
          200: '#EBDCB4',
          300: '#DFC789',
          400: '#D5B664',
          DEFAULT: '#C8A24D', // Sophisticated metallic gold
          hover: '#D8B45E',
          dark: '#9A7A31',
          border: 'rgba(200, 162, 77, 0.22)',
          borderStrong: 'rgba(200, 162, 77, 0.45)',
          glow: 'rgba(200, 162, 77, 0.15)',
        },
        dark: {
          base: '#0B0B0B',     // Deep matte black primary background
          surface: '#151515',  // Charcoal secondary background
          card: '#181818',     // Card surface
          cardHover: '#1F1F1F',// Card hover
          border: '#262626',   // Subtle border
          borderLight: '#333333',
        },
        text: {
          primary: '#F5F2EA',   // Warm white
          secondary: '#A6A6A6', // Muted gray
          muted: '#737373',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        display: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        gold: '0 4px 20px -2px rgba(200, 162, 77, 0.2)',
        'gold-lg': '0 10px 30px -4px rgba(200, 162, 77, 0.3)',
        subtle: '0 2px 10px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};

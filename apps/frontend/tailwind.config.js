/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0B0E14',
          surface: 'rgba(23, 27, 34, 0.7)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        neon: {
          blue: '#00D1FF',
          green: '#39FF14',
          red: '#FF3131',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'obsidian-radial': 'radial-gradient(circle at 50% 50%, #1A1F2B 0%, #0B0E14 100%)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 209, 255, 0.3)',
        'neon-green': '0 0 20px rgba(57, 255, 20, 0.3)',
      }
    },
  },
  plugins: [],
}

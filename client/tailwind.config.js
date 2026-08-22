/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          100: '#F9F7F7', // Primary text
          300: '#DBE2EF', // Secondary text
          400: '#aab6cf', // Muted text derivative
          700: '#1a4375', // Light borders derivative
          800: '#153860', // Dark borders derivative
          900: '#112D4E', // Panel backgrounds
          950: '#0b1d33', // Main app background derivative
        },
        indigo: {
          400: '#5c90d1', // Lighter accent derivative
          500: '#3F72AF', // Primary accent
          600: '#2d5482', // Accent hover derivative
          900: '#17395c', // Dark accent derivative
          950: '#112D4E', // Matching panel background
        }
      }
    },
  },
  plugins: [],
}

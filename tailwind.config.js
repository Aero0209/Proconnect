/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4285f4',
          dark: '#3367d6',
        },
        secondary: '#34a853',
      },
    },
  },
  plugins: [],
} 
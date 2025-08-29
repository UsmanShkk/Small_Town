/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',             // Root HTML file
    './src/**/*.{js,ts,jsx,tsx}', // JS/TS files in src
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',     // Custom primary color
        secondary: '#F59E0B',   // Custom secondary color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

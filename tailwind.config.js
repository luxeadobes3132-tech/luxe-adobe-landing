/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        sand: '#EDE9E3',
        warm: '#FAF9F7',
        charcoal: '#1C1C1C',
        soft: '#6B6B6B',
        olive: '#7A8450',
        gold: '#C6A75E',
      },
    },
  },
  plugins: [],
}

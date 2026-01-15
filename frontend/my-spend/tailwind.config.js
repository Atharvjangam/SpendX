/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#875cf5',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
      },
      screens: {
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
  ],
  theme: {
    extend: {
      spartan: ['Cinzel', 'serif'],
    },
    transitionProperty: {
      'opacity': 'opacity',
    },
  },
  plugins: [],
}
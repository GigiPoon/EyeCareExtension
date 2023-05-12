/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
    './popup/popup.html',
    './exercise.html'],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter"],
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#FFFFFF',
        'offwhite': '#F5F5F5',
        'offblack': '#312A2A',
        'blue': '#8399A8',
        'yellow': '#E6DFAF',
        'darkblue': '#0000EE',
      },
    },
  },
  plugins: [],
}


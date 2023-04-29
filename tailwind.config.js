/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
    './popup/popup.html'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#FFFFFF',
      'offwhite': '#F5F5F5',
      'offblack': '#100F0F',
      'blue': '#8399A8',
      'yellow': '#E6DFAF',
      'darkblue': '#0000EE',

    },
    extend: {
      fontFamily: {
        display: ["Inter"],
      },
    },
  },
  plugins: [],
}


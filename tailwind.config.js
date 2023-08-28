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
        'bluesky': '#3393EC',
        'lightblue': '#8FC8FD',
        'lightgrey': '#787B7D',
        'textword': '#312A2A',
      },
      screens: {
        'sm': '700px',
        // => @media (max-width: 700px) { ... }

        'md': '960px',
      // => @media (max-width: 960px) { ... }
      },
    },
  },
  plugins: [],
}


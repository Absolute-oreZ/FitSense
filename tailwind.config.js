/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class', // Enable dark mode via class
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#38B2AC',
          dark: '#319795',
          500: '#f0e1b9',
          600: '#5D5FEF',
        },
        secondary: {
          light: '#ED8936',
          dark: '#DD6B20',
          500: '#FFB620',
        },
        accent: {
          light: '#CBD5E0',
          dark: '#475569',
        },
        offWhite: '#D0DFFF',
        red: '#FF5A5A',
        dark: {
          1: '#000000',
          2: '#09090A',
          3: '#101012',
          4: '#1F1F22',
        },
        light: {
          1: '#FFFFFF',
          2: '#EFEFEF',
          3: '#f0d795',
          4: '#5C5C7B',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        xs: '.75rem',
        sm: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
      },
    },
    screens: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tak: {
          board: '#e7d8c3',
          white: '#f5f0e6',
          black: '#2b2b2b',
        },
      },
    },
  },
  plugins: [],
};

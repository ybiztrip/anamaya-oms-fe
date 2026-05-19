/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        flight: '#69A8FF',
        hotel: '#EF476F',
      },
    },
  },
  plugins: [],
};

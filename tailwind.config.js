/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fff5f2',
          100: '#ffe6df',
          200: '#ffd0c2',
          300: '#ffb199',
          400: '#ff8661',
          500: '#f4683f',
          600: '#e54d2e',
          700: '#bf3817',
          800: '#9f2f18',
          900: '#84291a',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
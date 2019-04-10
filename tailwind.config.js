/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        happy: { good: '#22c55e', ok: '#f59e0b', bad: '#ef4444' },
      },
    },
  },
  plugins: [],
}

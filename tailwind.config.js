/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      display: ['Inter'],
      body: ['Inter'],
    },
    colors: {
      'wf-bg': '#404040',
      'wf-text': '#d9d9d9',
      'wf-text-2': '#ababab',
    },
    extend: {},
  },
  plugins: [],
};

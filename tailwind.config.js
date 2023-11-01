/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      display: ['Inter'],
      body: ['Inter'],
    },

    extend: {
      colors: {
        'wf-almostBlack': '#1e1e1e',
        'wf-grey': '#383838',
        'wf-text-secondary': '#e0e0e0',
        'wf-text': '#ababab',
        'wf-border-color': 'rgba(255, 255, 255, 0.14)',
        'wf-input-color': 'rgba(0, 0, 0, 0.15)',
      },
      boxShadow: {
        'wf-input':
          '0px 1px 1px -1px rgba(0, 0, 0, 0.13) inset, 0px 3px 3px -3px rgba(0, 0, 0, 0.17) inset, 0px 4px 4px -4px rgba(0, 0, 0, 0.17) inset, 0px 8px 8px -8px rgba(0, 0, 0, 0.17) inset, 0px 12px 12px -12px rgba(0, 0, 0, 0.13) inset, 0px 16px 16px -16px rgba(0, 0, 0, 0.13) inset, 0 0 0 1px #2496ff;',
      },
    },
  },
  plugins: [],
};
// 0px 1px 1px -1px rgba(0, 0, 0, 0.13) inset, 0px 3px 3px -3px rgba(0, 0, 0, 0.17) inset, 0px 4px 4px -4px rgba(0, 0, 0, 0.17) inset, 0px 8px 8px -8px rgba(0, 0, 0, 0.17) inset, 0px 12px 12px -12px rgba(0, 0, 0, 0.13) inset, 0px 16px 16px -16px rgba(0, 0, 0, 0.13) inset;

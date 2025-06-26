/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '200': '800px',
      },
      typography: {
        DEFAULT: {
          css: {
            pre: {
              backgroundColor: '#2d3748', // Dark gray for code blocks
              color: '#e2e8f0', // Light gray text
              padding: '1rem',
              borderRadius: '0.5rem',
            },
            code: {
              backgroundColor: '#edf2f7', // Light gray for inline code
              color: '#2d3748',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: ''
            },
            'code::after': {
              content: ''
            }
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}


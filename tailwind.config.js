/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ember: {
          50: '#fff7ed',
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c'
        },
        spruce: {
          100: '#dff4ef',
          400: '#2dd4bf',
          500: '#14b8a6',
          700: '#0f766e'
        },
        ink: {
          900: '#0f172a'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif']
      },
      boxShadow: {
        soft: '0 24px 80px -40px rgba(15, 23, 42, 0.35)'
      }
    }
  },
  plugins: []
};

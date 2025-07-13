/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'nocensor-gradient': 'linear-gradient(135deg, #8a2be2 0%, #ff1493 100%)',
      },
      colors: {
        'nocensor-purple': '#8a2be2',
        'nocensor-pink': '#ff1493',
      }
    },
  },
  plugins: [],
};

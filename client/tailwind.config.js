/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'intro-img': "url('/src/assets/images/Background.png')",
      },
    },
  },
  plugins: [],
}


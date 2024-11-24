/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        zinc: { 900: "#121212" },
        pink: { 400: "#fc8b8d" },
        emerald: { 700: "#3e574b", 800: "#31493c" },
      },
      fontFamily: {
        alegreya: ['"Alegreya"', "serif"],
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: {
          fontSize: theme("fontSize.5xl"),
          marginBottom: theme("spacing.6"),
          fontFamily: theme("fontFamily.alegreya"),
          color: theme("colors.pink.400"),
        },
        h2: {
          fontSize: theme("fontSize.2xl"),
          marginBottom: theme("spacing.4"),
          marginTop: theme("spacing.4"),
          fontFamily: theme("fontFamily.alegreya"),
          color: theme("colors.pink.400"),
        },
        h3: {
          fontSize: theme("fontSize.lg"),
          marginBottom: theme("spacing.2"),
        },
      });
    }),
  ],
};

/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        zinc: { 900: "#121212" },
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: {
          fontSize: theme("fontSize.2xl"),
          marginBottom: theme("spacing.6"),
        },
        h2: {
          fontSize: theme("fontSize.xl"),
          marginBottom: theme("spacing.4"),
          marginTop: theme("spacing.4"),
        },
        h3: {
          fontSize: theme("fontSize.lg"),
          marginBottom: theme("spacing.2"),
        },
      });
    }),
  ],
};

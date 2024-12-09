/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        zinc: { 900: "#121212" },
        pink: { 400: "#fc8b8d" },
        emerald: { 700: "#3e574b", 800: "#31493c", 900: "#385245" },
        background: "#385245",
        text: "rgba(255, 255, 255, 0.87)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        alegreya: ['"Alegreya"', "serif"],
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme, addComponents }) {
      addBase({
        "#root": {
          "@apply font-sans text-text bg-background max-w-[1280px] text-center m-0 mx-auto":
            {},
        },
        ":root": {
          lineHeight: "1.5",
          fontWeight: "400",
          colorScheme: "light dark",
          color: "rgba(255, 255, 255, 0.87)",
          backgroundColor: "#385245",
          fontSynthesis: "none",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        body: {
          margin: 0,
          display: "flex",
          placeItems: "center",
          minWidth: "320px",
          minHeight: "100vh",
        },
        h1: {
          fontSize: theme("fontSize.5xl"),
          marginBottom: theme("spacing.1"),
          marginTop: theme("spacing.3"),
          fontFamily: theme("fontFamily.alegreya"),
          color: theme("colors.pink.400"),
        },
        h2: {
          fontSize: theme("fontSize.2xl"),
          marginBottom: theme("spacing.2"),
          marginTop: theme("spacing.3"),
          fontFamily: theme("fontFamily.alegreya"),
          color: theme("colors.pink.400"),
        },
        h3: {
          fontSize: theme("fontSize.lg"),
          marginBottom: theme("spacing.2"),
        },
      });
      addComponents({
        ".fixed-width": {
          width: "60vw",
        },
      });
    }),
  ],
};

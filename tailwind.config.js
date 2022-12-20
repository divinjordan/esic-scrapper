/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{html,js,tsx,ts}",
    "./src/components/**/*.{html,js,tsx,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0ea5e9",
        darkprimary: "#0c4a6e",
        secondary: "#db2777",
        darksecondary: "#881337",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

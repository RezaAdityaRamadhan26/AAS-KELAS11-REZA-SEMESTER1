/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff8f2",
          100: "#fff2e6",
          500: "#f97316",
        },
        accent: "#ff7a00",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};

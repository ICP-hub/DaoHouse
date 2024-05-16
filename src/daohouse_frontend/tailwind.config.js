/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      translate: {
        full: "100%",
        "-full": "-100%",
      },
      scale: {
        90: "0.9",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-30deg)" },
          "50%": { transform: "rotate(30deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 4s ease-in-out infinite",
      },
      screens: {
        small_phone: "400px",
        mobile: "500px",
        big_tablet: "800px",
        tablet: "1050px",
        laptop: "1280px",
        desktop: "1440px",
      },
    },
  },
  plugins: [],
};

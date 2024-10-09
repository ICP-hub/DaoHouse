/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Add Mulish font
      fontFamily: {
        mulish: ['Mulish', 'sans-serif'],
      },
      translate: {
        full: "100%",
        "-full": "-100%",
      },
      colors: {
        'dark-green': "#0E3746",
        'bg-color': '#DADEE4',
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
        mini_phone: "360px",
        iphone_SE: "375px",
        iphone12_pro: "390px",
        iphone14_pro_max: "430px",
        small_phone: "400px",
        mobile: "500px",
        big_phone: "800px",
        tablet: "1000px",
        laptop: "1280px",
        desktop: "1440px",
        large_desktop: "1480px",
        xl_desktop: "1700px"
      },
      blur: {
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};

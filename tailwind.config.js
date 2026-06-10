/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        primary: {
          50: "#FAF6F0",
          100: "#F3EBE0",
          200: "#E5D5C0",
          300: "#D4BC9E",
          400: "#C9A962",
          500: "#B8924A",
          600: "#9C7A3D",
          700: "#7D6233",
          800: "#5D4E37",
          900: "#3D3429",
        },
        accent: {
          DEFAULT: "#C9A962",
          light: "#E5C98A",
          dark: "#A68940",
        },
        neutral: {
          bg: "#FAF6F0",
          card: "#FFFFFF",
          border: "#E5D5C0",
          text: "#3D3429",
          muted: "#7D6E5D",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', "Georgia", "serif"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(93, 78, 55, 0.08)",
        "card-hover": "0 8px 24px rgba(93, 78, 55, 0.12)",
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
};

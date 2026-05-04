import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF0000",
        "primary-hover": "#FF3333",
        background: "#000000",
        accent: "#000000",
        muted: "#666666",
      },
      fontFamily: {
        display: ["Rethink Sans", "sans-serif"],
        sans: ["Rethink Sans", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;

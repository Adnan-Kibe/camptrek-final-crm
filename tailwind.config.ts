// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",   
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",     
    "./src/**/*.{js,ts,jsx,tsx}",     
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0b0c10",
        secondary: "#1DE9B6",
      },
    },
  },
  plugins: [],
};

export default config;
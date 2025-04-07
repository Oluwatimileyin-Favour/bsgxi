import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        'xs': '350px', // Custom breakpoint for extra small screens
         // Fine pointer (e.g., mouse)
         'fine-pointer': { 'raw': '(hover: hover) and (pointer: fine)' },

         // Coarse pointer (e.g., touch)
         'coarse-pointer': { 'raw': '(hover: none) and (pointer: coarse)' },
      },
    },
  },
  plugins: [],
} satisfies Config;

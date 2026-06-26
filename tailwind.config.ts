import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./config/**/*.json"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(44, 75, 128, 0.12)",
        card: "0 14px 36px rgba(44, 75, 128, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

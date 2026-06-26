import type { ThemeTokens } from "./types";

export const minimalTheme: ThemeTokens = {
  name: "minimal",
  colors: {
    primary: "#8CA7D8",
    secondary: "#F1F6FF",
    background: "#FCFDFF",
    surface: "rgba(255,255,255,0.74)",
    surfaceStrong: "rgba(255,255,255,0.86)",
    text: "#1A1A1A",
    muted: "#727986",
    border: "rgba(140,167,216,0.24)"
  },
  gradient: "linear-gradient(180deg, #FCFDFF 0%, #F1F6FF 100%)",
  shadow: "0 20px 64px rgba(90, 110, 145, 0.10)"
};

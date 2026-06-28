import type { ThemeTokens } from "./types";

export const blueTheme: ThemeTokens = {
  name: "blue",
  colors: {
    primary: "#8CB8FF",
    secondary: "#EAF2FF",
    background: "#FAFBFF",
    surface: "rgba(255,255,255,0.78)",
    surfaceStrong: "#FFFFFF",
    text: "#1A1A1A",
    muted: "#6D7480",
    border: "rgba(140,184,255,0.30)"
  },
  gradient: "linear-gradient(180deg, #FAFBFF 0%, #EEF5FF 52%, #FFFFFF 100%)",
  shadow: "0 20px 56px rgba(84, 128, 201, 0.12)",
  shadowCard: "0 14px 36px rgba(44, 75, 128, 0.08)",
  shadowSoft: "0 20px 60px rgba(44, 75, 128, 0.12)"
};

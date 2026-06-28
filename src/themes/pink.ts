import type { ThemeTokens } from "./types";

export const pinkTheme: ThemeTokens = {
  name: "pink",
  colors: {
    primary: "#9ABEFF",
    secondary: "#EEF5FF",
    background: "#FBFDFF",
    surface: "rgba(255,255,255,0.76)",
    surfaceStrong: "#FFFFFF",
    text: "#1A1A1A",
    muted: "#6F7785",
    border: "rgba(154,190,255,0.28)"
  },
  gradient: "linear-gradient(180deg, #FBFDFF 0%, #EEF5FF 58%, #FFFFFF 100%)",
  shadow: "0 22px 68px rgba(90, 130, 205, 0.12)",
  shadowCard: "0 14px 36px rgba(44, 75, 128, 0.08)",
  shadowSoft: "0 20px 60px rgba(44, 75, 128, 0.12)"
};

import type { ThemeTokens } from "./types";

export const bubblegumTheme: ThemeTokens = {
  name: "bubblegum",
  colors: {
    primary: "#d04f99",
    secondary: "#8acfd1",
    background: "#f6e6ee",
    surface: "rgba(253,237,201,0.78)",
    surfaceStrong: "#fdedc9",
    text: "#333333",
    muted: "#7a7a7a",
    border: "rgba(208,79,153,0.28)"
  },
  gradient:
    "linear-gradient(180deg, #f6e6ee 0%, #fdedc9 48%, #b2e1eb 100%)",
  shadow: "0 22px 68px rgba(208, 79, 153, 0.16)",
  shadowCard: "0 14px 36px rgba(208, 79, 153, 0.13)",
  shadowSoft: "0 20px 60px rgba(132, 210, 226, 0.18)"
};

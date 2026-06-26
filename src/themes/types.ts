import type { ThemeName } from "@/types/site";

export type ThemeTokens = {
  name: ThemeName;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    surfaceStrong: string;
    text: string;
    muted: string;
    border: string;
  };
  gradient: string;
  shadow: string;
};

import { blueTheme } from "./blue";
import { bubblegumTheme } from "./bubblegum";
import { minimalTheme } from "./minimal";
import { pinkTheme } from "./pink";
import { yanyunNightTheme } from "./yanyunNight";
import type { ThemeTokens } from "./types";
import type { ThemeName } from "@/types/site";

export const themes: Record<ThemeName, ThemeTokens> = {
  blue: blueTheme,
  bubblegum: bubblegumTheme,
  pink: pinkTheme,
  minimal: minimalTheme,
  yanyunNight: yanyunNightTheme
};

export type { ThemeTokens };

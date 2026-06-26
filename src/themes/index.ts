import { blueTheme } from "./blue";
import { minimalTheme } from "./minimal";
import { pinkTheme } from "./pink";
import type { ThemeTokens } from "./types";
import type { ThemeName } from "@/types/site";

export const themes: Record<ThemeName, ThemeTokens> = {
  blue: blueTheme,
  pink: pinkTheme,
  minimal: minimalTheme
};

export type { ThemeTokens };

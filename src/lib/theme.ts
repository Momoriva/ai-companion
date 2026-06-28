import { siteConfig } from "./site-config";
import { themes } from "@/themes";
import type { ThemeTokens } from "@/themes";
import type { CSSProperties } from "react";

export const activeTheme: ThemeTokens = themes[siteConfig.theme] ?? themes.blue;

export function themeStyle(theme: ThemeTokens = activeTheme): CSSProperties {
  return {
    background: theme.gradient,
    "--color-primary": theme.colors.primary,
    "--color-secondary": theme.colors.secondary,
    "--color-background": theme.colors.background,
    "--color-surface": theme.colors.surface,
    "--color-surface-strong": theme.colors.surfaceStrong,
    "--color-text": theme.colors.text,
    "--color-muted": theme.colors.muted,
    "--color-border": theme.colors.border,
    "--theme-gradient": theme.gradient,
    "--theme-shadow": theme.shadow,
    "--theme-shadow-card": theme.shadowCard,
    "--theme-shadow-soft": theme.shadowSoft,
    "--theme-font-sans":
      theme.name === "yanyunNight"
        ? "\"Noto Serif SC\", \"Songti SC\", \"STSong\", \"SimSun\", \"Source Han Serif SC\", Georgia, serif"
        : undefined
  } as CSSProperties;
}

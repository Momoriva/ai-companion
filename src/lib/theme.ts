import { siteConfig } from "./site-config";
import { themes } from "@/themes";
import type { ThemeTokens } from "@/themes";
import type { CSSProperties } from "react";

export const activeTheme: ThemeTokens = themes[siteConfig.theme] ?? themes.blue;

export function themeStyle(theme: ThemeTokens = activeTheme): CSSProperties {
  return {
    "--color-primary": theme.colors.primary,
    "--color-secondary": theme.colors.secondary,
    "--color-background": theme.colors.background,
    "--color-surface": theme.colors.surface,
    "--color-surface-strong": theme.colors.surfaceStrong,
    "--color-text": theme.colors.text,
    "--color-muted": theme.colors.muted,
    "--color-border": theme.colors.border,
    "--theme-gradient": theme.gradient,
    "--theme-shadow": theme.shadow
  } as CSSProperties;
}

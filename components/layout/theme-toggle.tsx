"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export type Theme = "dark" | "light";
export const THEME_KEY = "parfumcity-theme";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage may be unavailable; the choice then lasts for the page only.
  }
}

/**
 * Dark/light switch. The initial theme is applied by an inline script in the
 * layout before hydration, so this component only reads it after mount.
 */
export function ThemeToggle({ className, withLabel = false }: { className?: string; withLabel?: boolean }) {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = next === "light" ? t("theme.toLight") : t("theme.toDark");

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
      aria-label={label}
      title={label}
      className={cn(
        "flex items-center gap-3 text-cream-2 transition-colors duration-300 hover:text-cream",
        withLabel ? "caption" : "h-11 w-11 justify-center",
        className,
      )}
    >
      {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
      {withLabel && <span>{label}</span>}
    </button>
  );
}

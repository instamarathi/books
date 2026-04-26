import React from "react";
import { useTheme, type Theme } from "../useTheme";

const NEXT: Record<Theme, Theme> = { system: "light", light: "dark", dark: "system" };
const LABEL: Record<Theme, string> = { system: "Auto", light: "Light", dark: "Dark" };
const ICON: Record<Theme, string> = { system: "🌗", light: "☀", dark: "🌙" };

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(NEXT[theme])}
      aria-label={`Theme: ${LABEL[theme]}. Click to cycle.`}
      title={`Theme: ${LABEL[theme]}`}
    >
      {ICON[theme]}
    </button>
  );
};

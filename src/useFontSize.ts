import { useEffect, useState } from "react";

export type FontSize = "small" | "medium" | "large";

const PX: Record<FontSize, string> = { small: "16px", medium: "18px", large: "20px" };
const STORAGE_KEY = "font-size";

function readStored(): FontSize {
  const v = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  return v === "small" || v === "medium" || v === "large" ? v : "medium";
}

export function useFontSize() {
  const [size, setSizeState] = useState<FontSize>(readStored);

  useEffect(() => {
    document.documentElement.style.setProperty("--body-size", PX[size]);
  }, [size]);

  const setSize = (s: FontSize) => {
    localStorage.setItem(STORAGE_KEY, s);
    setSizeState(s);
  };

  return { size, setSize };
}

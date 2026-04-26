import React from "react";
import { useFontSize, type FontSize } from "../useFontSize";

const SIZES: FontSize[] = ["small", "medium", "large"];
const LABEL: Record<FontSize, string> = { small: "A-", medium: "A", large: "A+" };

export const FontSizeToggle: React.FC = () => {
  const { size, setSize } = useFontSize();
  return (
    <div className="font-size-toggle" role="group" aria-label="Font size">
      {SIZES.map((s) => (
        <button
          key={s}
          onClick={() => setSize(s)}
          aria-pressed={size === s}
          className={size === s ? "active" : ""}
        >
          {LABEL[s]}
        </button>
      ))}
    </div>
  );
};

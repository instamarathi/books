import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { FontSizeToggle } from "./FontSizeToggle";
import { ShareButton } from "./ShareButton";

export const TopBar: React.FC<{
  backTo: string;
  backLabel: string;
  shareTitle: string;
  shareUrl: string;
}> = ({ backTo, backLabel, shareTitle, shareUrl }) => {
  return (
    <div className="top-bar">
      <Link to={backTo} className="top-bar-back" aria-label={backLabel}>← {backLabel}</Link>
      <div className="top-bar-actions">
        <FontSizeToggle />
        <ThemeToggle />
        <ShareButton title={shareTitle} url={shareUrl} />
      </div>
    </div>
  );
};

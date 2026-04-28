import React from "react";
import { Link } from "react-router-dom";

export const TopBar: React.FC<{
  backTo: string;
  backLabel: string;
}> = ({ backTo, backLabel }) => {
  return (
    <div className="top-bar">
      <Link to={backTo} className="top-bar-back" aria-label={backLabel}>← {backLabel}</Link>
    </div>
  );
};

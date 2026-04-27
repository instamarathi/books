import React from "react";

export const QuickRefCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <aside className="quick-ref-card" data-testid="quick-ref-card">
      <h3 className="quick-ref-card-title">Quick reference</h3>
      <div className="quick-ref-card-body">{children}</div>
    </aside>
  );
};

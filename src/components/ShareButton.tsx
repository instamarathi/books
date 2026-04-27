import React, { useState } from "react";

export const ShareButton: React.FC<{ title: string; url: string }> = ({ title, url }) => {
  const [toast, setToast] = useState<string | null>(null);
  const onClick = async () => {
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title, url });
        return;
      } catch {
        return;
      }
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      setToast("Link copied");
      setTimeout(() => setToast(null), 1500);
    }
  };
  return (
    <>
      <button className="share-btn" onClick={onClick} aria-label="Share">
        ↗ Share
      </button>
      {toast && <div className="share-toast">{toast}</div>}
    </>
  );
};

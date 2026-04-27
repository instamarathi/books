import React, { useEffect, useState } from "react";

export const ReadingProgressBar: React.FC<{
  onProgress?: (frac: number) => void;
}> = ({ onProgress }) => {
  const [frac, setFrac] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const f = total > 0 ? Math.min(1, Math.max(0, doc.scrollTop / total)) : 0;
      setFrac(f);
      onProgress?.(f);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onProgress]);
  return (
    <div className="reading-progress" aria-hidden="true">
      <div className="reading-progress-fill" style={{ width: `${frac * 100}%` }} />
    </div>
  );
};

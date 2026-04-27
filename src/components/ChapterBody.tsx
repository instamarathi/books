import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { QuickRefCard } from "./QuickRefCard";

const QUICK_REF_RE = /^##\s+Quick\s+reference\s*$/im;

function splitBody(body: string): { main: string; quickRef: string | null } {
  const match = QUICK_REF_RE.exec(body);
  if (!match) return { main: body, quickRef: null };
  const idx = match.index;
  const main = body.slice(0, idx).trimEnd();
  const after = body.slice(idx);
  // Drop the marker heading itself; keep what follows.
  const quickRef = after.replace(QUICK_REF_RE, "").trimStart();
  return { main, quickRef };
}

export const ChapterBody: React.FC<{ body: string }> = ({ body }) => {
  const { main, quickRef } = splitBody(body);
  return (
    <>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{main}</ReactMarkdown>
      {quickRef && (
        <QuickRefCard>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{quickRef}</ReactMarkdown>
        </QuickRefCard>
      )}
    </>
  );
};

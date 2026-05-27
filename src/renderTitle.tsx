import type { ReactNode } from "react";

export function renderTitle(title: string): ReactNode {
  const parts = title.split(/~~(.*?)~~/);
  if (parts.length === 1) return title;
  return parts.map((part, i) =>
    i % 2 === 1 ? <del key={i}>{part}</del> : part,
  );
}

export function stripStrikethrough(title: string): string {
  return title.replace(/~~(.*?)~~/g, "$1");
}

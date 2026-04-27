import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type EssayMeta = {
  bookSlug: string;
  essaySlug: string;
  title: string;
  order: number;
  summary: string;
  read_time: number;
};

export function readBookSlugs(booksDir: string): string[] {
  return fs.readdirSync(booksDir).filter((d) =>
    fs.statSync(path.join(booksDir, d)).isDirectory(),
  );
}

export function readEssaysFor(booksDir: string, bookSlug: string): EssayMeta[] {
  const dir = path.join(booksDir, bookSlug);
  const out: EssayMeta[] = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const essaySlug = file.replace(/\.md$/, "");
    const summary = data.summary
      ? String(data.summary)
      : content.split(/\n\s*\n/)[0]?.replace(/[#>*_`]/g, "").trim().slice(0, 160) ?? "";
    out.push({
      bookSlug,
      essaySlug,
      title: String(data.title ?? essaySlug),
      order: Number(data.order ?? 0),
      summary,
      read_time: Number(data.read_time ?? 0),
    });
  }
  out.sort((a, b) => a.order - b.order);
  return out;
}

export function readAllEssays(booksDir: string): EssayMeta[] {
  return readBookSlugs(booksDir).flatMap((b) => readEssaysFor(booksDir, b));
}

export const SITE_BASE = process.env.VITE_BASE ?? "/books/";
export const SITE_ORIGIN = "https://instamarathi.github.io";

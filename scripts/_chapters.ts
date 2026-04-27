import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ChapterMeta = {
  bookSlug: string;
  chapterSlug: string;
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

export function readChaptersFor(booksDir: string, bookSlug: string): ChapterMeta[] {
  const dir = path.join(booksDir, bookSlug);
  const out: ChapterMeta[] = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const chapterSlug = file.replace(/\.md$/, "");
    const summary = data.summary
      ? String(data.summary)
      : content.split(/\n\s*\n/)[0]?.replace(/[#>*_`]/g, "").trim().slice(0, 160) ?? "";
    out.push({
      bookSlug,
      chapterSlug,
      title: String(data.title ?? chapterSlug),
      order: Number(data.order ?? 0),
      summary,
      read_time: Number(data.read_time ?? 0),
    });
  }
  out.sort((a, b) => a.order - b.order);
  return out;
}

export function readAllChapters(booksDir: string): ChapterMeta[] {
  return readBookSlugs(booksDir).flatMap((b) => readChaptersFor(booksDir, b));
}

export const SITE_BASE = process.env.VITE_BASE ?? "/books/";
export const SITE_ORIGIN = "https://instamarathi.github.io";

import fs from "node:fs";
import path from "node:path";
import { readAllChapters, readBookSlugs, SITE_BASE, SITE_ORIGIN } from "./_chapters";

const ROOT = path.resolve(".");
const BOOKS_DIR = path.join(ROOT, "books");
const DIST = path.join(ROOT, "dist");

function url(p: string): string {
  return `${SITE_ORIGIN}${SITE_BASE}${p}`.replace(/\/+$/, "/");
}

function entry(loc: string): string {
  return `  <url><loc>${loc}</loc></url>`;
}

function main() {
  const lines: string[] = [];
  lines.push(entry(url("")));
  for (const b of readBookSlugs(BOOKS_DIR)) {
    lines.push(entry(url(`${b}/`)));
  }
  for (const c of readAllChapters(BOOKS_DIR)) {
    lines.push(entry(url(`${c.bookSlug}/${c.chapterSlug}/`)));
  }
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    lines.join("\n") +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), xml);
  console.log(`wrote sitemap.xml with ${lines.length} entries`);
}

main();

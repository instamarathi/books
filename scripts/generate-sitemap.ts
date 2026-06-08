import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { readAllChapters, readBookSlugs, SITE_BASE, SITE_ORIGIN } from "./_chapters";

const ROOT = path.resolve(".");
const BOOKS_DIR = path.join(ROOT, "books");
const DIST = path.join(ROOT, "dist");

type SitemapChapter = {
  bookSlug: string;
  chapterSlug: string;
};

type SitemapInput = {
  bookSlugs: string[];
  chapters: SitemapChapter[];
  siteOrigin: string;
  siteBase: string;
};

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function url(siteOrigin: string, siteBase: string, p: string): string {
  return `${siteOrigin}${siteBase}${p}`.replace(/\/+$/, "/");
}

function entry(loc: string): string {
  return `  <url><loc>${xmlEscape(loc)}</loc></url>`;
}

export function buildSitemapXml({
  bookSlugs,
  chapters,
  siteOrigin,
  siteBase,
}: SitemapInput): string {
  const lines: string[] = [];
  lines.push(entry(url(siteOrigin, siteBase, "")));
  for (const b of bookSlugs) {
    lines.push(entry(url(siteOrigin, siteBase, `${b}/`)));
  }
  for (const c of chapters) {
    lines.push(entry(url(siteOrigin, siteBase, `${c.bookSlug}/${c.chapterSlug}/`)));
  }
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    lines.join("\n") +
    `\n</urlset>\n`
  );
}

function main() {
  const bookSlugs = readBookSlugs(BOOKS_DIR);
  const chapters = readAllChapters(BOOKS_DIR);
  const xml = buildSitemapXml({
    bookSlugs,
    chapters,
    siteOrigin: SITE_ORIGIN,
    siteBase: SITE_BASE,
  });
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), xml);
  console.log(`wrote sitemap.xml with ${bookSlugs.length + chapters.length + 1} entries`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

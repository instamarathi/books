import fs from "node:fs";
import path from "node:path";
import { readAllChapters, readBookSlugs, SITE_BASE, SITE_ORIGIN } from "./_chapters";

const ROOT = path.resolve(".");
const BOOKS_DIR = path.join(ROOT, "books");
const DIST = path.join(ROOT, "dist");

const TEMPLATE = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

function stripStrikethrough(s: string): string {
  return s.replace(/~~(.*?)~~/g, "$1");
}

function escAttr(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Strip pre-existing head tags that we're about to override, so we don't emit
// duplicate <title>, og:type, og:locale, etc.
function stripExistingTags(template: string, keys: Iterable<string>): string {
  let out = template;
  for (const k of keys) {
    if (k === "title") {
      out = out.replace(/<title>[^<]*<\/title>\s*/i, "");
    } else if (k.startsWith("og:") || k.startsWith("twitter:")) {
      const re = new RegExp(`<meta\\s+property=["']${k}["'][^>]*>\\s*`, "gi");
      out = out.replace(re, "");
    } else {
      const re = new RegExp(`<meta\\s+name=["']${k}["'][^>]*>\\s*`, "gi");
      out = out.replace(re, "");
    }
  }
  return out;
}

function injectMeta(template: string, meta: Record<string, string>): string {
  const stripped = stripExistingTags(template, Object.keys(meta));
  const tags = Object.entries(meta)
    .map(([k, v]) => {
      const safe = escAttr(v);
      if (k === "title") return `<title>${safe}</title>`;
      if (k.startsWith("og:") || k.startsWith("twitter:")) {
        return `<meta property="${k}" content="${safe}" />`;
      }
      return `<meta name="${k}" content="${safe}" />`;
    })
    .join("\n    ");
  return stripped.replace("</head>", `    ${tags}\n  </head>`);
}

function chapterUrl(bookSlug: string, chapterSlug: string): string {
  return `${SITE_ORIGIN}${SITE_BASE}${bookSlug}/${chapterSlug}/`;
}

function ogImage(bookSlug: string, chapterSlug: string): string {
  return `${SITE_ORIGIN}${SITE_BASE}og/${bookSlug}/${chapterSlug}.png`;
}

function writeStub(filePath: string, html: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
}

function main() {
  const chapters = readAllChapters(BOOKS_DIR);
  for (const c of chapters) {
    const html = injectMeta(TEMPLATE, {
      title: `${stripStrikethrough(c.title)} — instamarathi books`,
      description: c.summary,
      "og:title": stripStrikethrough(c.title),
      "og:description": c.summary,
      "og:type": "article",
      "og:url": chapterUrl(c.bookSlug, c.chapterSlug),
      "og:image": ogImage(c.bookSlug, c.chapterSlug),
      "og:locale": "mr_IN",
      "twitter:card": "summary_large_image",
      "twitter:title": stripStrikethrough(c.title),
      "twitter:description": c.summary,
      "twitter:image": ogImage(c.bookSlug, c.chapterSlug),
    });
    const outPath = path.join(DIST, c.bookSlug, c.chapterSlug, "index.html");
    writeStub(outPath, html);
    console.log(`wrote ${path.relative(DIST, outPath)}`);
  }

  for (const bookSlug of readBookSlugs(BOOKS_DIR)) {
    const metaPath = path.join(BOOKS_DIR, bookSlug, "meta.json");
    if (!fs.existsSync(metaPath)) continue;
    const m = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as {
      title: string; subtitle?: string;
    };
    const html = injectMeta(TEMPLATE, {
      title: `${stripStrikethrough(m.title)} — instamarathi books`,
      description: m.subtitle ?? stripStrikethrough(m.title),
      "og:title": stripStrikethrough(m.title),
      "og:description": m.subtitle ?? stripStrikethrough(m.title),
      "og:type": "book",
      "og:url": `${SITE_ORIGIN}${SITE_BASE}${bookSlug}/`,
      "og:locale": "mr_IN",
    });
    writeStub(path.join(DIST, bookSlug, "index.html"), html);
    console.log(`wrote ${bookSlug}/index.html`);
  }

  const fourOhFour = path.join(DIST, "404.html");
  fs.writeFileSync(fourOhFour, TEMPLATE);
  console.log("wrote 404.html");
}

main();

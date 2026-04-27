import fs from "node:fs";
import path from "node:path";
import { readAllEssays, readBookSlugs, SITE_BASE, SITE_ORIGIN } from "./_essays";

const ROOT = path.resolve(".");
const BOOKS_DIR = path.join(ROOT, "books");
const DIST = path.join(ROOT, "dist");

const TEMPLATE = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

function injectMeta(template: string, meta: Record<string, string>): string {
  const tags = Object.entries(meta)
    .map(([k, v]) => {
      const safe = String(v).replace(/"/g, "&quot;");
      if (k === "title") return `<title>${safe}</title>`;
      if (k.startsWith("og:") || k.startsWith("twitter:")) {
        return `<meta property="${k}" content="${safe}" />`;
      }
      return `<meta name="${k}" content="${safe}" />`;
    })
    .join("\n    ");
  return template.replace("</head>", `    ${tags}\n  </head>`);
}

function essayUrl(bookSlug: string, essaySlug: string): string {
  return `${SITE_ORIGIN}${SITE_BASE}${bookSlug}/${essaySlug}/`;
}

function ogImage(bookSlug: string, essaySlug: string): string {
  return `${SITE_ORIGIN}${SITE_BASE}og/${bookSlug}/${essaySlug}.png`;
}

function writeStub(filePath: string, html: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
}

function main() {
  const essays = readAllEssays(BOOKS_DIR);
  for (const e of essays) {
    const html = injectMeta(TEMPLATE, {
      title: `${e.title} — instamarathi books`,
      description: e.summary,
      "og:title": e.title,
      "og:description": e.summary,
      "og:type": "article",
      "og:url": essayUrl(e.bookSlug, e.essaySlug),
      "og:image": ogImage(e.bookSlug, e.essaySlug),
      "og:locale": "mr_IN",
      "twitter:card": "summary_large_image",
      "twitter:title": e.title,
      "twitter:description": e.summary,
      "twitter:image": ogImage(e.bookSlug, e.essaySlug),
    });
    const outPath = path.join(DIST, e.bookSlug, e.essaySlug, "index.html");
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
      title: `${m.title} — instamarathi books`,
      description: m.subtitle ?? m.title,
      "og:title": m.title,
      "og:description": m.subtitle ?? m.title,
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

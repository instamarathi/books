import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readAllChapters } from "./_chapters";

function stripStrikethrough(s: string): string {
  return s.replace(/~~(.*?)~~/g, "$1");
}

const ROOT = path.resolve(".");
const BOOKS_DIR = path.join(ROOT, "books");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(DIST, "og");
const FONTS_DIR = path.join(ROOT, "scripts", "fonts");

function loadLocalFont(filename: string): Buffer {
  const p = path.join(FONTS_DIR, filename);
  if (!fs.existsSync(p)) {
    throw new Error(
      `Missing font file: ${p}\n` +
      `To bootstrap, download these two .ttf files into scripts/fonts/:\n` +
      `  - Mukta-Regular.ttf   from https://fonts.google.com/specimen/Mukta\n` +
      `  - Inter-Regular.ttf   from https://fonts.google.com/specimen/Inter\n` +
      `OG card generation will fail until these exist.`,
    );
  }
  return fs.readFileSync(p);
}

async function main() {
  const chapters = readAllChapters(BOOKS_DIR);
  if (chapters.length === 0) {
    console.log("No chapters found; skipping OG card generation.");
    return;
  }
  const mukta = loadLocalFont("Mukta-Regular.ttf");
  const inter = loadLocalFont("Inter-Regular.ttf");

  fs.mkdirSync(OUT, { recursive: true });

  for (const c of chapters) {
    const node = {
      type: "div",
        props: {
          style: {
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px",
            background: "#FAF7F2",
            color: "#1F1B16",
            fontFamily: "Mukta",
          },
          children: [
            {
              type: "div",
              props: {
                style: { fontSize: "32px", color: "#C76C2D", fontFamily: "Inter" },
                children: `प्रकरण ${c.order}`,
              },
            },
            {
              type: "div",
              props: {
                style: { fontSize: "72px", lineHeight: 1.2 },
                children: stripStrikethrough(c.title),
              },
            },
            {
              type: "div",
              props: {
                style: { fontSize: "28px", color: "#6B6359", fontFamily: "Inter" },
                children: "instamarathi books",
              },
            },
          ],
        },
      };
    // satori's type accepts ReactNode; we pass a plain JSX-tree-shaped object
    // which it also handles at runtime.
    const svg = await satori(
      node as unknown as Parameters<typeof satori>[0],
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Mukta", data: mukta, weight: 400, style: "normal" },
          { name: "Inter", data: inter, weight: 400, style: "normal" },
        ],
      },
    );
    const png = new Resvg(svg, { background: "#FAF7F2" }).render().asPng();
    const outDir = path.join(OUT, c.bookSlug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `${c.chapterSlug}.png`), png);
    console.log(`wrote og/${c.bookSlug}/${c.chapterSlug}.png`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

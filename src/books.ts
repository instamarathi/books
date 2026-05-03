// Tiny browser-safe frontmatter parser. We control the chapter format: a strict
// subset of YAML — `key: value` lines, scalar values only (string or number),
// optional matching quotes. No nesting, no multiline. Avoids gray-matter,
// which depends on Node's Buffer and crashes in the browser.
function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  if (!raw.startsWith("---\n") && !raw.startsWith("---\r\n")) {
    return { data: {}, content: raw };
  }
  const after = raw.replace(/^---\r?\n/, "");
  const endMatch = /\r?\n---\r?\n?/.exec(after);
  if (!endMatch) return { data: {}, content: raw };
  const yaml = after.slice(0, endMatch.index);
  const content = after.slice(endMatch.index + endMatch[0].length);

  const data: Record<string, unknown> = {};
  for (const line of yaml.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (/^-?\d+$/.test(val)) data[key] = Number(val);
    else if (/^-?\d+\.\d+$/.test(val)) data[key] = Number(val);
    else data[key] = val;
  }
  return { data, content };
}

export type Chapter = {
  bookSlug: string;
  slug: string;
  title: string;
  order: number;
  summary: string;
  read_time: number;
  body: string;
};

export type CategoryKey =
  | "career"
  | "mindset"
  | "parenting"
  | "home"
  | "society"
  | "other";

export type BookKind = "howto" | "fiction" | "essay";

export const BOOK_KINDS: BookKind[] = ["howto", "fiction", "essay"];

export const KIND_LABELS: Record<BookKind, string> = {
  howto: "मार्गदर्शन",
  fiction: "कथा",
  essay: "लेख",
};

export type BookMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  credit?: string;
  category?: CategoryKey;
  kind?: BookKind;
  chapter_order: string[];
};

export function bookKind(meta: Pick<BookMeta, "kind">): BookKind {
  return meta.kind && BOOK_KINDS.includes(meta.kind) ? meta.kind : "howto";
}

export type Book = BookMeta & {
  chapters: Chapter[];
};

// Marathi label + short blurb for each category. The order of keys here is the
// display order on the bookshelf.
export const CATEGORIES: Record<
  CategoryKey,
  { label: string; blurb: string; emoji: string }
> = {
  career: {
    label: "कारकीर्द",
    blurb: "नवीन भूमिका, manager-ship आणि कामाच्या ठिकाणचे प्रश्न.",
    emoji: "💼",
  },
  mindset: {
    label: "आत्म-विकास",
    blurb: "स्वतःशी संवाद, priorities आणि शांत मन.",
    emoji: "🌱",
  },
  parenting: {
    label: "पालकत्व",
    blurb: "मुलांशी बोलणं, सवयी आणि घरातलं वातावरण.",
    emoji: "👪",
  },
  home: {
    label: "घर आणि जीवनशैली",
    blurb: "रोजचं घर, वेळेचं नियोजन आणि सोप्या सवयी.",
    emoji: "🏠",
  },
  society: {
    label: "समाज आणि विचार",
    blurb: "चळवळ, माध्यमं आणि आजूबाजूचा गोंधळ समजून घेणं.",
    emoji: "🧭",
  },
  other: {
    label: "इतर",
    blurb: "इतर विषयांवरची पुस्तकं.",
    emoji: "📚",
  },
};

export const CATEGORY_ORDER: CategoryKey[] = [
  "career",
  "mindset",
  "parenting",
  "home",
  "society",
  "other",
];

const REQUIRED = ["title", "slug", "order", "read_time"] as const;

function firstParagraph(body: string, max = 160): string {
  const trimmed = body.trim();
  const para = trimmed.split(/\n\s*\n/)[0] ?? "";
  const cleaned = para.replace(/[#>*_`]/g, "").trim();
  return cleaned.length > max ? cleaned.slice(0, max - 1) + "…" : cleaned;
}

export function parseChapter(raw: string, bookSlug: string, fallbackSlug: string): Chapter {
  const { data, content } = parseFrontmatter(raw);
  for (const field of REQUIRED) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      throw new Error(`Chapter ${bookSlug}/${fallbackSlug}: missing required field "${field}"`);
    }
  }
  const order = Number(data.order);
  const read_time = Number(data.read_time);
  if (Number.isNaN(order)) {
    throw new Error(`Chapter ${bookSlug}/${fallbackSlug}: order is not a number`);
  }
  if (Number.isNaN(read_time)) {
    throw new Error(`Chapter ${bookSlug}/${fallbackSlug}: read_time is not a number`);
  }
  return {
    bookSlug,
    slug: String(data.slug ?? fallbackSlug),
    title: String(data.title),
    order,
    read_time,
    summary: data.summary ? String(data.summary) : firstParagraph(content),
    body: content,
  };
}

// Eager glob: load all book metadata and all chapter markdown at module load.
// Vite resolves these at build time and bundles them.
const metaModules = import.meta.glob("/books/*/meta.json", {
  eager: true,
  import: "default",
}) as Record<string, BookMeta>;

const rawChapterModules = import.meta.glob("/books/*/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function pathParts(filePath: string): { bookSlug: string; chapterSlug: string } {
  // filePath is like "/books/how-to-talk/01-feelings.md"
  const parts = filePath.split("/");
  return {
    bookSlug: parts[2] ?? "",
    chapterSlug: (parts[3] ?? "").replace(/\.md$/, ""),
  };
}

export function loadBooks(): Book[] {
  const books: Book[] = [];
  for (const [path, meta] of Object.entries(metaModules)) {
    const bookSlug = path.split("/")[2] ?? "";
    const chapters: Chapter[] = [];
    for (const [chapterPath, raw] of Object.entries(rawChapterModules)) {
      const parts = pathParts(chapterPath);
      if (parts.bookSlug !== bookSlug) continue;
      chapters.push(parseChapter(raw, bookSlug, parts.chapterSlug));
    }
    chapters.sort((a, b) => a.order - b.order);
    books.push({ ...meta, chapters });
  }
  books.sort((a, b) => a.title.localeCompare(b.title, "mr-IN"));
  return books;
}

export function findBook(books: Book[], bookSlug: string): Book | undefined {
  return books.find((b) => b.slug === bookSlug);
}

export function findChapter(book: Book, chapterSlug: string): Chapter | undefined {
  return book.chapters.find((c) => c.slug === chapterSlug);
}

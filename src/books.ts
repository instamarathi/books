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
  | "fiction"
  | "other";

export type BookKind = "howto" | "fiction" | "essay";

export const BOOK_KINDS: BookKind[] = ["howto", "fiction", "essay"];

export const KIND_LABELS: Record<BookKind, string> = {
  howto: "मार्गदर्शन",
  fiction: "कथा",
  essay: "लेख",
};

export const KIND_LABELS_BY_LANGUAGE: Record<BookLanguage, Record<BookKind, string>> = {
  marathi: KIND_LABELS,
  english: {
    howto: "Guide",
    fiction: "Fiction",
    essay: "Essay",
  },
  hinglish: {
    howto: "Guide",
    fiction: "Fiction",
    essay: "Essay",
  },
};

export type BookMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  credit?: string;
  sources?: string;
  category?: CategoryKey;
  kind?: BookKind;
  language?: BookLanguage;
  created_order?: number;
  chapter_order: string[];
};

export type BookLanguage = "marathi" | "english" | "hinglish";

export function bookLanguage(meta: Pick<BookMeta, "language" | "slug">): BookLanguage {
  if (meta.language === "english" || meta.language === "marathi" || meta.language === "hinglish") {
    return meta.language;
  }
  if (meta.slug.endsWith("-hinglish")) return "hinglish";
  return meta.slug.endsWith("-english") ? "english" : "marathi";
}

export function bookKind(meta: Pick<BookMeta, "kind">): BookKind {
  return meta.kind && BOOK_KINDS.includes(meta.kind) ? meta.kind : "howto";
}

export function readTimeLabel(
  meta: Pick<BookMeta, "language" | "slug">,
  minutes: number,
): string {
  return `${minutes} ${bookLanguage(meta) === "marathi" ? "मिनिटे" : "min"}`;
}

export function chapterCountLabel(
  meta: Pick<BookMeta, "language" | "slug">,
  count: number,
): string {
  if (bookLanguage(meta) === "marathi") return `${count} प्रकरणं`;
  return `${count} chapter${count === 1 ? "" : "s"}`;
}

export function kindLabel(
  meta: Pick<BookMeta, "language" | "slug">,
  kind: BookKind,
): string {
  return KIND_LABELS_BY_LANGUAGE[bookLanguage(meta)][kind];
}

export type Book = BookMeta & {
  chapters: Chapter[];
};

// Stable creation order for the bookshelf. Derived from the first committed
// date of each book's meta.json; ties in the same commit use path order.
const BOOK_CREATION_ORDER: Record<string, number> = {
  "how-to-talk": 1,
  "kaay-molavche": 2,
  "nav-bhoomika": 3,
  apeksha: 4,
  "prashna-vichara": 5,
  "nitnetake-ghar": 6,
  "ho-mhanyaaadhi": 7,
  "risk-ka-ghet-nahi": 8,
  "soneri-pinjara": 9,
  "sahaa-topya": 10,
  "mala-sangaychay": 11,
  "rikamya-ghara": 12,
  "midlife-redesign": 13,
  "vachun-hot-nahi": 14,
  "midlife-redesign-english": 15,
  "why-dont-we-take-risk": 16,
  "ti-mage-padel-ka": 17,
  "he-sagla-kasa-chalta": 18,
  "manatli-garibi": 19,
  "the-poverty-within": 20,
  "ghoda-kuthe-adlay": 21,
  "dusra-darwaja": 22,
  "char-hazar-aathavde": 23,
  "hasara-manager-thanda-office": 24,
  "shant-netrutva": 25,
  "motha-karaycha-hota": 26,
  "yash-nahi-kimmat-nivda": 27,
  "spiral-madhun-baher": 28,
  "cool-disaycha-ki-motha-vhaycha": 30,
  "abhyasala-ac-hava-ka": 31,
  "lokanna-thambva": 32,
};

export function compareBooksByCreationNewestFirst(a: BookMeta, b: BookMeta): number {
  const orderA = a.created_order ?? Number.NEGATIVE_INFINITY;
  const orderB = b.created_order ?? Number.NEGATIVE_INFINITY;
  if (orderA !== orderB) return orderB - orderA;
  return a.title.localeCompare(b.title, "mr-IN");
}

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
  fiction: {
    label: "कथा",
    blurb: "मूळ मराठी कथा आणि भावनिक प्रसंग.",
    emoji: "✦",
  },
  other: {
    label: "इतर",
    blurb: "इतर विषयांवरची पुस्तकं.",
    emoji: "📚",
  },
};

export const CATEGORIES_BY_LANGUAGE: Record<
  BookLanguage,
  Record<CategoryKey, { label: string; blurb: string; emoji: string }>
> = {
  marathi: CATEGORIES,
  english: {
    career: {
      label: "Career",
      blurb: "New roles, managers, and work problems.",
      emoji: "💼",
    },
    mindset: {
      label: "Mindset",
      blurb: "Inner conversations, priorities, and a calmer mind.",
      emoji: "🌱",
    },
    parenting: {
      label: "Parenting",
      blurb: "Talking with children, habits, and the home atmosphere.",
      emoji: "👪",
    },
    home: {
      label: "Home and life",
      blurb: "Daily home life, time planning, and simple habits.",
      emoji: "🏠",
    },
    society: {
      label: "Society and ideas",
      blurb: "Movements, media, and understanding the noise around us.",
      emoji: "🧭",
    },
    fiction: {
      label: "Fiction",
      blurb: "Original stories and emotional scenes.",
      emoji: "✦",
    },
    other: {
      label: "Other",
      blurb: "Books on other subjects.",
      emoji: "📚",
    },
  },
  hinglish: {
    career: {
      label: "Career",
      blurb: "Nayi roles, managers aur office ke asli sawaal.",
      emoji: "💼",
    },
    mindset: {
      label: "Self-help",
      blurb: "Khud se baat, priorities aur dimaag ke purane patterns.",
      emoji: "🌱",
    },
    parenting: {
      label: "Parenting",
      blurb: "Bachchon se baat, habits aur ghar ka mahaul.",
      emoji: "👪",
    },
    home: {
      label: "Ghar aur life",
      blurb: "Roz ka ghar, waqt aur simple habits.",
      emoji: "🏠",
    },
    society: {
      label: "Society aur ideas",
      blurb: "Media, movements aur aas-paas ka shor samajhna.",
      emoji: "🧭",
    },
    fiction: {
      label: "Fiction",
      blurb: "Original kahaniyan aur pehchaan ke scenes.",
      emoji: "✦",
    },
    other: {
      label: "Baaki kitaabein",
      blurb: "Doosre subjects par kitaabein.",
      emoji: "📚",
    },
  },
};

export function categoryInfo(
  meta: Pick<BookMeta, "language" | "slug">,
  category: CategoryKey,
): { label: string; blurb: string; emoji: string } {
  return CATEGORIES_BY_LANGUAGE[bookLanguage(meta)][category];
}

export const CATEGORY_ORDER: CategoryKey[] = [
  "career",
  "mindset",
  "parenting",
  "home",
  "society",
  "fiction",
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
    books.push({
      ...meta,
      created_order: meta.created_order ?? BOOK_CREATION_ORDER[meta.slug],
      chapters,
    });
  }
  books.sort(compareBooksByCreationNewestFirst);
  return books;
}

export function findBook(books: Book[], bookSlug: string): Book | undefined {
  return books.find((b) => b.slug === bookSlug);
}

export function findChapter(book: Book, chapterSlug: string): Chapter | undefined {
  return book.chapters.find((c) => c.slug === chapterSlug);
}

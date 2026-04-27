import matter from "gray-matter";

export type Essay = {
  bookSlug: string;
  slug: string;
  title: string;
  order: number;
  summary: string;
  read_time: number;
  body: string;
};

export type BookMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  credit?: string;
  essay_order: string[];
};

export type Book = BookMeta & {
  essays: Essay[];
};

const REQUIRED = ["title", "slug", "order", "read_time"] as const;

function firstParagraph(body: string, max = 160): string {
  const trimmed = body.trim();
  const para = trimmed.split(/\n\s*\n/)[0] ?? "";
  const cleaned = para.replace(/[#>*_`]/g, "").trim();
  return cleaned.length > max ? cleaned.slice(0, max - 1) + "…" : cleaned;
}

export function parseEssay(raw: string, bookSlug: string, fallbackSlug: string): Essay {
  const { data, content } = matter(raw);
  for (const field of REQUIRED) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      throw new Error(`Essay ${bookSlug}/${fallbackSlug}: missing required field "${field}"`);
    }
  }
  const order = Number(data.order);
  const read_time = Number(data.read_time);
  if (Number.isNaN(order)) {
    throw new Error(`Essay ${bookSlug}/${fallbackSlug}: order is not a number`);
  }
  if (Number.isNaN(read_time)) {
    throw new Error(`Essay ${bookSlug}/${fallbackSlug}: read_time is not a number`);
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

// Eager glob: load all book metadata and all essay markdown at module load.
// Vite resolves these at build time and bundles them.
const metaModules = import.meta.glob("/books/*/meta.json", {
  eager: true,
  import: "default",
}) as Record<string, BookMeta>;

const rawEssayModules = import.meta.glob("/books/*/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function pathParts(filePath: string): { bookSlug: string; essaySlug: string } {
  // filePath is like "/books/how-to-talk/01-feelings.md"
  const parts = filePath.split("/");
  return {
    bookSlug: parts[2] ?? "",
    essaySlug: (parts[3] ?? "").replace(/\.md$/, ""),
  };
}

export function loadBooks(): Book[] {
  const books: Book[] = [];
  for (const [path, meta] of Object.entries(metaModules)) {
    const bookSlug = path.split("/")[2] ?? "";
    const essays: Essay[] = [];
    for (const [essayPath, raw] of Object.entries(rawEssayModules)) {
      const parts = pathParts(essayPath);
      if (parts.bookSlug !== bookSlug) continue;
      essays.push(parseEssay(raw, bookSlug, parts.essaySlug));
    }
    essays.sort((a, b) => a.order - b.order);
    books.push({ ...meta, essays });
  }
  books.sort((a, b) => a.title.localeCompare(b.title, "mr-IN"));
  return books;
}

export function findBook(books: Book[], bookSlug: string): Book | undefined {
  return books.find((b) => b.slug === bookSlug);
}

export function findEssay(book: Book, essaySlug: string): Essay | undefined {
  return book.essays.find((e) => e.slug === essaySlug);
}

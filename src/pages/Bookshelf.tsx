import { Link } from "react-router-dom";
import {
  loadBooks,
  CATEGORIES,
  CATEGORY_ORDER,
  type Book,
  type Chapter,
  type CategoryKey,
} from "../books";
import { useAuth } from "../useAuth";
import { useProgress, type ProgressMap } from "../useProgress";
import { BookCover } from "../components/BookCover";

function bookCategory(book: Book): CategoryKey {
  return book.category && CATEGORIES[book.category] ? book.category : "other";
}

function chapterTeaser(body: string, max = 200): string {
  for (const para of body.split(/\n\s*\n/)) {
    const trimmed = para.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const cleaned = trimmed.replace(/^\*\*(.+)\*\*$/, "$1").replace(/[*_`>]/g, "");
    if (cleaned.length < 30) continue;
    return cleaned.length > max ? cleaned.slice(0, max - 1) + "…" : cleaned;
  }
  return "";
}

function pickFeaturedBook(books: Book[]): Book | null {
  if (books.length === 0) return null;
  const start = new Date(new Date().getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((Date.now() - start) / 86400000);
  return books[dayOfYear % books.length];
}

function findInProgress(
  books: Book[],
  progress: ProgressMap,
): { book: Book; chapter: Chapter } | null {
  for (const slug of Object.keys(progress)) {
    const bp = progress[slug];
    if (!bp?.current_chapter) continue;
    const book = books.find((b) => b.slug === slug);
    if (!book) continue;
    const chapter = book.chapters.find((c) => c.order === bp.current_chapter);
    if (chapter) return { book, chapter };
  }
  return null;
}

function FeaturedHero({
  book,
  chapter,
  mode,
}: {
  book: Book;
  chapter: Chapter;
  mode: "today" | "continue";
}) {
  const teaser = chapter.summary || chapterTeaser(chapter.body);
  const eyebrow =
    mode === "continue" ? "वाचणं सुरू ठेवा" : "आजचं पहिलं प्रकरण";
  const cta = mode === "continue" ? "तिथून पुढे →" : "वाचायला सुरू करा →";
  return (
    <section className="featured" aria-labelledby="featured-title">
      <Link to={`/${book.slug}/${chapter.slug}`} className="featured-link">
        <BookCover book={book} variant="hero" />
        <div className="featured-body">
          <span className="featured-eyebrow">{eyebrow}</span>
          <h1 id="featured-title" className="featured-chapter-title">
            {chapter.title}
          </h1>
          <p className="featured-book-name">{book.title}</p>
          {teaser && <p className="featured-teaser">{teaser}</p>}
          <span className="featured-cta">{cta}</span>
        </div>
      </Link>
    </section>
  );
}

function BookCard({
  book,
  currentChapterOrder,
}: {
  book: Book;
  currentChapterOrder: number | undefined;
}) {
  const continueChapter =
    currentChapterOrder !== undefined
      ? book.chapters.find((c) => c.order === currentChapterOrder)
      : undefined;
  return (
    <li className="book-card" data-category={bookCategory(book)}>
      <Link to={`/${book.slug}`} className="book-card-link">
        <BookCover book={book} />
        <div className="book-card-body">
          {book.subtitle && <p className="book-subtitle">{book.subtitle}</p>}
          <div className="book-card-bottom">
            <span className="book-meta">{book.chapters.length} प्रकरणं</span>
            <span className="book-card-arrow" aria-hidden="true">→</span>
          </div>
        </div>
      </Link>
      {continueChapter && (
        <Link
          to={`/${book.slug}/${continueChapter.slug}`}
          className="book-continue"
        >
          वाचणं सुरू ठेवा: {continueChapter.order}. {continueChapter.title} →
        </Link>
      )}
    </li>
  );
}

export const Bookshelf = () => {
  const books = loadBooks();
  const { user } = useAuth();
  const { progress } = useProgress(user);

  const grouped = new Map<CategoryKey, Book[]>();
  for (const b of books) {
    const k = bookCategory(b);
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k)!.push(b);
  }
  const sectionsToRender = CATEGORY_ORDER.filter(
    (k) => (grouped.get(k)?.length ?? 0) > 0,
  );

  const inProgress = findInProgress(books, progress);
  const featuredBook = inProgress ? null : pickFeaturedBook(books);
  const featuredChapter = featuredBook?.chapters.find((c) => c.order === 1);

  return (
    <section className="bookshelf">
      {inProgress ? (
        <FeaturedHero
          book={inProgress.book}
          chapter={inProgress.chapter}
          mode="continue"
        />
      ) : featuredBook && featuredChapter ? (
        <FeaturedHero
          book={featuredBook}
          chapter={featuredChapter}
          mode="today"
        />
      ) : null}

      {sectionsToRender.length > 1 && (
        <nav className="bookshelf-nav" aria-label="विषय">
          {sectionsToRender.map((k) => (
            <a key={k} href={`#cat-${k}`} className="bookshelf-nav-chip">
              <span aria-hidden="true">{CATEGORIES[k].emoji}</span>
              {CATEGORIES[k].label}
            </a>
          ))}
        </nav>
      )}

      {books.length === 0 ? (
        <p>(अजून पुस्तके नाहीत.)</p>
      ) : (
        sectionsToRender.map((k) => {
          const list = grouped.get(k)!;
          const cat = CATEGORIES[k];
          return (
            <div key={k} id={`cat-${k}`} className="category-section">
              <header className="category-header">
                <h2 className="category-title">
                  <span aria-hidden="true">{cat.emoji}</span> {cat.label}
                </h2>
                <p className="category-blurb">{cat.blurb}</p>
              </header>
              <ul className="book-list">
                {list.map((b) => (
                  <BookCard
                    key={b.slug}
                    book={b}
                    currentChapterOrder={progress[b.slug]?.current_chapter}
                  />
                ))}
              </ul>
            </div>
          );
        })
      )}
    </section>
  );
};

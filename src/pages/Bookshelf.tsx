import { Link } from "react-router-dom";
import {
  loadBooks,
  bookKind,
  bookLanguage,
  compareBooksByCreationNewestFirst,
  CATEGORIES,
  CATEGORY_ORDER,
  categoryInfo,
  chapterCountLabel,
  kindLabel,
  type Book,
  type Chapter,
  type CategoryKey,
  type BookLanguage,
} from "../books";
import { BookCover } from "../components/BookCover";
import { renderTitle } from "../renderTitle";

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
  const lang = bookLanguage(book);
  const eyebrow = mode === "continue"
    ? lang === "marathi"
      ? "वाचणं सुरू ठेवा"
      : lang === "hinglish" ? "Padhna jaari rakho" : "Continue reading"
    : lang === "marathi"
      ? "आजचं पहिलं प्रकरण"
      : lang === "hinglish" ? "Aaj ka pehla chapter" : "Today's first chapter";
  const cta = mode === "continue"
    ? lang === "marathi"
      ? "तिथून पुढे →"
      : lang === "hinglish" ? "Yahin se aage →" : "Continue from here →"
    : lang === "marathi"
      ? "वाचायला सुरू करा →"
      : lang === "hinglish" ? "Padhna shuru karo →" : "Start reading →";
  return (
    <section className="featured" aria-labelledby="featured-title">
      <Link to={`/${book.slug}/${chapter.slug}`} className="featured-link">
        <BookCover book={book} variant="hero" />
        <div className="featured-body">
          <span className="featured-eyebrow">{eyebrow}</span>
          <h1 id="featured-title" className="featured-chapter-title">
            {renderTitle(chapter.title)}
          </h1>
          <p className="featured-book-name">{renderTitle(book.title)}</p>
          {teaser && <p className="featured-teaser">{teaser}</p>}
          <span className="featured-cta">{cta}</span>
        </div>
      </Link>
    </section>
  );
}

function BookCard({ book }: { book: Book }) {
  const kind = bookKind(book);
  return (
    <li className="book-card" data-category={bookCategory(book)} data-kind={kind}>
      <Link to={`/${book.slug}`} className="book-card-link">
        <BookCover book={book} />
        <div className="book-card-body">
          {book.subtitle && <p className="book-subtitle">{book.subtitle}</p>}
          <div className="book-card-bottom">
            <span className="book-meta">
              {kind !== "howto" && (
                <span className="book-kind-badge">{kindLabel(book, kind)}</span>
              )}
              {chapterCountLabel(book, book.chapters.length)}
            </span>
            <span className="book-card-arrow" aria-hidden="true">→</span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export const Bookshelf = ({
  language,
}: {
  language?: BookLanguage;
}) => {
  const books = loadBooks();
  return <BookshelfView books={books} language={language} />;
};

export const BookshelfView = ({
  books,
  language,
}: {
  books: Book[];
  language?: BookLanguage;
}) => {
  const visibleBooks = language ? books.filter((b) => bookLanguage(b) === language) : books;

  const grouped = new Map<CategoryKey, Book[]>();
  for (const b of visibleBooks) {
    const k = bookCategory(b);
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k)!.push(b);
  }
  for (const list of grouped.values()) {
    list.sort(compareBooksByCreationNewestFirst);
  }
  const sectionsToRender = CATEGORY_ORDER.filter(
    (k) => (grouped.get(k)?.length ?? 0) > 0,
  );

  const featuredBook = pickFeaturedBook(visibleBooks);
  const featuredChapter = featuredBook?.chapters.find((c) => c.order === 1);

  return (
    <section className="bookshelf">
      {language && (
        <div className="language-switcher">
          <Link to="/marathi" className={language === "marathi" ? "active" : ""}>
            Marathi books
          </Link>
          <Link to="/english" className={language === "english" ? "active" : ""}>
            English books
          </Link>
          <Link to="/hinglish" className={language === "hinglish" ? "active" : ""}>
            Hinglish books
          </Link>
        </div>
      )}
      {featuredBook && featuredChapter ? (
        <FeaturedHero
          book={featuredBook}
          chapter={featuredChapter}
          mode="today"
        />
      ) : null}

      {sectionsToRender.length > 1 && (
        <nav className="bookshelf-nav" aria-label={language === "marathi" ? "विषय" : "Topics"}>
          {sectionsToRender.map((k) => (
            <a key={k} href={`#cat-${k}`} className="bookshelf-nav-chip">
              <span aria-hidden="true">{categoryInfo({ language, slug: "" }, k).emoji}</span>
              {categoryInfo({ language, slug: "" }, k).label}
            </a>
          ))}
        </nav>
      )}

      {visibleBooks.length === 0 ? (
        <p>{language === "marathi" ? "(अजून पुस्तके नाहीत.)" : "(No books yet.)"}</p>
      ) : (
        sectionsToRender.map((k) => {
          const list = grouped.get(k)!;
          const cat = categoryInfo({ language, slug: "" }, k);
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
                  <BookCard key={b.slug} book={b} />
                ))}
              </ul>
            </div>
          );
        })
      )}
    </section>
  );
};

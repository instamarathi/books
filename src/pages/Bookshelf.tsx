import { Link } from "react-router-dom";
import {
  loadBooks,
  CATEGORIES,
  CATEGORY_ORDER,
  type Book,
  type CategoryKey,
} from "../books";
import { useAuth } from "../useAuth";
import { useProgress } from "../useProgress";

function continueReading(book: Book, currentChapterOrder: number | undefined) {
  if (!currentChapterOrder) return null;
  const chapter = book.chapters.find((c) => c.order === currentChapterOrder);
  if (!chapter) return null;
  return (
    <Link
      to={`/${book.slug}/${chapter.slug}`}
      className="book-continue"
      onClick={(e) => e.stopPropagation()}
    >
      वाचणं सुरू ठेवा: {chapter.order}. {chapter.title} →
    </Link>
  );
}

function bookCategory(book: Book): CategoryKey {
  return book.category && CATEGORIES[book.category] ? book.category : "other";
}

function BookCard({
  book,
  currentChapterOrder,
}: {
  book: Book;
  currentChapterOrder: number | undefined;
}) {
  const cat = CATEGORIES[bookCategory(book)];
  return (
    <li className="book-card" data-category={bookCategory(book)}>
      <Link to={`/${book.slug}`} className="book-card-link">
        <div className="book-card-top">
          <span className="book-card-emoji" aria-hidden="true">
            {cat.emoji}
          </span>
          <span className="book-card-pill">{cat.label}</span>
        </div>
        <h3 className="book-card-title">{book.title}</h3>
        {book.subtitle && <p className="book-subtitle">{book.subtitle}</p>}
        <div className="book-card-bottom">
          <span className="book-meta">{book.chapters.length} प्रकरणं</span>
          <span className="book-card-arrow" aria-hidden="true">
            वाचायला सुरू करा →
          </span>
        </div>
      </Link>
      {continueReading(book, currentChapterOrder)}
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

  return (
    <section className="bookshelf">
      <div className="bookshelf-hero">
        <h1 className="bookshelf-title">मराठीतून, फोनवर वाचण्यासाठी.</h1>
        <p className="bookshelf-tagline">
          रोजच्या आयुष्यासाठी उपयोगी पुस्तकं — career, पालकत्व, घर आणि स्वतःसाठी.
          एका पुस्तकात ९ छोटी प्रकरणं, प्रत्येक ५–८ मिनिटांचं.
        </p>
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
      </div>

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

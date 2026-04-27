import { Link } from "react-router-dom";
import { loadBooks, type Book } from "../books";
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

export const Bookshelf = () => {
  const books = loadBooks();
  const { user } = useAuth();
  const { progress } = useProgress(user);
  return (
    <section className="bookshelf">
      <h2>पुस्तके</h2>
      {books.length === 0 ? (
        <p>(अजून पुस्तके नाहीत.)</p>
      ) : (
        <ul className="book-list">
          {books.map((b) => {
            const bp = progress[b.slug];
            return (
              <li key={b.slug} className="book-card">
                <Link to={`/${b.slug}`}>
                  <h3>{b.title}</h3>
                  {b.subtitle && <p className="book-subtitle">{b.subtitle}</p>}
                  <span className="book-meta">{b.chapters.length} प्रकरणं</span>
                </Link>
                {continueReading(b, bp?.current_chapter)}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

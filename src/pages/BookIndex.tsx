import { Link, useParams } from "react-router-dom";
import { findBook, loadBooks } from "../books";
import { useAuth } from "../useAuth";
import { useProgress } from "../useProgress";

const FREE_CHAPTER_ORDER = 1;

export const BookIndex = () => {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  const book = findBook(loadBooks(), bookSlug ?? "");

  const { user } = useAuth();
  const { completedChapters } = useProgress(user);

  if (!book) {
    return <p>पुस्तक सापडले नाही.</p>;
  }

  const completed = new Set(completedChapters[book.slug] ?? []);

  return (
    <section className="book-index">
      <h2>{book.title}</h2>
      {book.subtitle && <p className="book-subtitle">{book.subtitle}</p>}
      {book.credit && <p className="book-credit">{book.credit}</p>}
      {!user && (
        <p className="book-paywall-note">
          पहिलं प्रकरण मोफत. पुढच्यांसाठी sign in करा.
        </p>
      )}
      {user && (
        <p className="book-actions">
          <Link to={`/print/${book.slug}`} className="book-pdf-btn">
            📄 Download PDF
          </Link>
        </p>
      )}
      <ol className="chapter-list">
        {book.chapters.map((c) => {
          const locked = !user && c.order > FREE_CHAPTER_ORDER;
          const marker = completed.has(c.order)
            ? "✓"
            : locked
              ? "🔒"
              : `${c.order}.`;
          return (
            <li
              key={c.slug}
              className={"chapter-row" + (locked ? " chapter-row-locked" : "")}
            >
              <Link to={`/${book.slug}/${c.slug}`}>
                <span className="chapter-number">{marker}</span>
                <span className="chapter-title">{c.title}</span>
                <span className="chapter-meta">{c.read_time} मि</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

import { Link, useParams } from "react-router-dom";
import { findBook, loadBooks } from "../books";
import { useAuth } from "../useAuth";
import { useProgress } from "../useProgress";

const FREE_ESSAY_ORDER = 1;

export const BookIndex = () => {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  const book = findBook(loadBooks(), bookSlug ?? "");

  const { user } = useAuth();
  const { completedEssays } = useProgress(user);

  if (!book) {
    return <p>पुस्तक सापडले नाही.</p>;
  }

  const completed = new Set(completedEssays[book.slug] ?? []);

  return (
    <section className="book-index">
      <h2>{book.title}</h2>
      {book.subtitle && <p className="book-subtitle">{book.subtitle}</p>}
      {book.credit && <p className="book-credit">{book.credit}</p>}
      {!user && (
        <p className="book-paywall-note">
          पहिला निबंध मोफत. पुढच्यांसाठी sign in करा.
        </p>
      )}
      <ol className="essay-list">
        {book.essays.map((e) => {
          const locked = !user && e.order > FREE_ESSAY_ORDER;
          const marker = completed.has(e.order)
            ? "✓"
            : locked
              ? "🔒"
              : `${e.order}.`;
          return (
            <li
              key={e.slug}
              className={"essay-row" + (locked ? " essay-row-locked" : "")}
            >
              <Link to={`/${book.slug}/${e.slug}`}>
                <span className="essay-number">{marker}</span>
                <span className="essay-title">{e.title}</span>
                <span className="essay-meta">{e.read_time} मि</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { findBook, loadBooks } from "../books";
import { ChapterBody } from "../components/ChapterBody";
import { useAuth } from "../useAuth";

const FREE_CHAPTER_ORDER = 1;

export const PrintBook = () => {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  const book = findBook(loadBooks(), bookSlug ?? "");
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !book) return;
    let cancelled = false;
    const trigger = () => {
      if (!cancelled) window.print();
    };
    const fontsReady =
      typeof document !== "undefined" && (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready;
    if (fontsReady) {
      fontsReady.then(() => setTimeout(trigger, 150));
    } else {
      setTimeout(trigger, 400);
    }
    return () => {
      cancelled = true;
    };
  }, [book, loading]);

  if (!book) {
    return (
      <p>
        पुस्तक सापडले नाही. <Link to="/">मुख्य पानावर परत</Link>
      </p>
    );
  }

  const chapters = book.chapters.filter(
    (c) => user || c.order <= FREE_CHAPTER_ORDER,
  );

  return (
    <div className="print-book">
      <div className="print-screen-toolbar no-print">
        <Link to={`/${book.slug}`} className="print-back">
          ← {book.title}
        </Link>
        <div className="print-toolbar-actions">
          {!user && (
            <span className="print-paywall-note">
              Sign in करून पूर्ण पुस्तक download करा.
            </span>
          )}
          <button
            type="button"
            className="print-now-btn"
            onClick={() => window.print()}
          >
            📄 PDF save करा
          </button>
        </div>
      </div>

      <section className="print-cover">
        <h1 className="print-book-title">{book.title}</h1>
        {book.subtitle && (
          <p className="print-book-subtitle">{book.subtitle}</p>
        )}
        {book.credit && <p className="print-book-credit">{book.credit}</p>}
        <p className="print-book-source">instamarathi.github.io/books</p>
      </section>

      {chapters.map((c) => (
        <article key={c.slug} className="print-chapter">
          <header className="print-chapter-header">
            <p className="print-chapter-num">प्रकरण {c.order}</p>
            <h2 className="print-chapter-title">{c.title}</h2>
          </header>
          <div className="print-chapter-body">
            <ChapterBody body={c.body} />
          </div>
        </article>
      ))}

      {!user && book.chapters.length > chapters.length && (
        <section className="print-paywall-page">
          <h2>आणखी {book.chapters.length - chapters.length} प्रकरणं</h2>
          <p>
            पुढची प्रकरणं वाचण्यासाठी instamarathi.github.io/books वर sign in
            करा.
          </p>
        </section>
      )}
    </div>
  );
};

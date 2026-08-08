import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { bookLanguage, findBook, loadBooks } from "../books";
import { ChapterBody } from "../components/ChapterBody";

export const PrintBook = () => {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  const book = findBook(loadBooks(), bookSlug ?? "");
  const language = book ? bookLanguage(book) : bookLanguage({ slug: bookSlug ?? "" });

  useEffect(() => {
    if (!book) return;
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
  }, [book]);

  if (!book) {
    return (
      <p>
        {language === "marathi" ? "पुस्तक सापडले नाही." : "Book not found."}{" "}
        <Link to="/">{language === "marathi" ? "मुख्य पानावर परत" : "Back to home"}</Link>
      </p>
    );
  }

  const chapters = book.chapters;

  return (
    <div className={`print-book ${language === "marathi" ? "print-book-marathi" : "print-book-english"}`}>
      <div className="print-screen-toolbar no-print">
        <Link to={`/${book.slug}`} className="print-back">
          ← {book.title}
        </Link>
        <div className="print-toolbar-actions">
          <button
            type="button"
            className="print-now-btn"
            onClick={() => window.print()}
          >
            📄 Download PDF
          </button>
        </div>
      </div>

      <section className="print-cover">
        <h1 className="print-book-title">{book.title}</h1>
        {book.subtitle && (
          <p className="print-book-subtitle">{book.subtitle}</p>
        )}
        {book.credit && <p className="print-book-credit">{book.credit}</p>}
        {book.sources && (
          <p className="print-book-credit print-book-sources">{book.sources}</p>
        )}
        <p className="print-book-source">instamarathi.github.io/books</p>
      </section>

      {chapters.map((c) => (
        <article key={c.slug} className="print-chapter">
          <header className="print-chapter-header">
            <p className="print-chapter-num">
              {language === "marathi" ? "प्रकरण" : "Chapter"} {c.order}
            </p>
            <h2 className="print-chapter-title">{c.title}</h2>
          </header>
          <div className="print-chapter-body">
            <ChapterBody body={c.body} />
          </div>
        </article>
      ))}
    </div>
  );
};

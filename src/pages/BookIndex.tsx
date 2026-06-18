import { Link, useParams } from "react-router-dom";
import { bookLanguage, findBook, loadBooks, readTimeLabel } from "../books";
import { renderTitle } from "../renderTitle";

export const BookIndex = () => {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  const book = findBook(loadBooks(), bookSlug ?? "");
  const language = book ? bookLanguage(book) : bookLanguage({ slug: bookSlug ?? "" });

  if (!book) {
    return <p>{language === "english" ? "Book not found." : "पुस्तक सापडले नाही."}</p>;
  }

  return (
    <section className={`book-index ${language === "english" ? "book-index-english" : "book-index-marathi"}`}>
      <h2>{renderTitle(book.title)}</h2>
      {book.subtitle && <p className="book-subtitle">{book.subtitle}</p>}
      {book.credit && <p className="book-credit">{book.credit}</p>}
      <p className="book-actions">
        <Link to={`/print/${book.slug}`} className="book-pdf-btn">
          📄 Download PDF
        </Link>
      </p>
      <ol className="chapter-list">
        {book.chapters.map((c) => (
          <li key={c.slug} className="chapter-row">
            <Link to={`/${book.slug}/${c.slug}`}>
              <span className="chapter-number">{c.order}.</span>
              <span className="chapter-title">{c.title}</span>
              <span className="chapter-meta">{readTimeLabel(book, c.read_time)}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

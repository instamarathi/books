import React from "react";
import { Link, useParams } from "react-router-dom";
import { findBook, loadBooks } from "../books";

export const BookIndex: React.FC = () => {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  const book = findBook(loadBooks(), bookSlug ?? "");

  if (!book) {
    return <p>पुस्तक सापडले नाही.</p>;
  }

  return (
    <section className="book-index">
      <h2>{book.title}</h2>
      {book.subtitle && <p className="book-subtitle">{book.subtitle}</p>}
      {book.credit && <p className="book-credit">{book.credit}</p>}
      <ol className="essay-list">
        {book.essays.map((e) => (
          <li key={e.slug} className="essay-row">
            <Link to={`/${book.slug}/${e.slug}`}>
              <span className="essay-number">{e.order}.</span>
              <span className="essay-title">{e.title}</span>
              <span className="essay-meta">{e.read_time} मि</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

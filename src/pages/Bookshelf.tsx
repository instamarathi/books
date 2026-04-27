import React from "react";
import { Link } from "react-router-dom";
import { loadBooks } from "../books";

export const Bookshelf: React.FC = () => {
  const books = loadBooks();
  return (
    <section className="bookshelf">
      <h2>पुस्तके</h2>
      {books.length === 0 ? (
        <p>(अजून पुस्तके नाहीत.)</p>
      ) : (
        <ul className="book-list">
          {books.map((b) => (
            <li key={b.slug} className="book-card">
              <Link to={`/${b.slug}`}>
                <h3>{b.title}</h3>
                {b.subtitle && <p className="book-subtitle">{b.subtitle}</p>}
                <span className="book-meta">
                  {b.essays.length} निबंध
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

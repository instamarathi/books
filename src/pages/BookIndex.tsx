import React from "react";
import { useParams } from "react-router-dom";

export const BookIndex: React.FC = () => {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  return (
    <section className="book-index">
      <h2>Book: {bookSlug}</h2>
      <p>(essay list goes here)</p>
    </section>
  );
};

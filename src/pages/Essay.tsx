import React from "react";
import { useParams, Link } from "react-router-dom";
import { findBook, findEssay, loadBooks } from "../books";
import { EssayBody } from "../components/EssayBody";

export const Essay: React.FC = () => {
  const { bookSlug, essaySlug } = useParams<{ bookSlug: string; essaySlug: string }>();
  const book = findBook(loadBooks(), bookSlug ?? "");
  const essay = book ? findEssay(book, essaySlug ?? "") : undefined;

  if (!book || !essay) {
    return <p>निबंध सापडला नाही. <Link to="/">मुख्य पानावर परत</Link></p>;
  }

  return (
    <article className="essay">
      <header className="essay-header">
        <Link to={`/${book.slug}`} className="essay-back">← {book.title}</Link>
        <h1>{essay.title}</h1>
        <p className="essay-meta">{essay.read_time} मिनिटे</p>
      </header>
      <EssayBody body={essay.body} />
    </article>
  );
};

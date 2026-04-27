import React, { useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { findBook, findEssay, loadBooks } from "../books";
import { EssayBody } from "../components/EssayBody";
import { TopBar } from "../components/TopBar";
import { ReadingProgressBar } from "../components/ReadingProgressBar";
import { BackToTop } from "../components/BackToTop";
import { useAuth } from "../useAuth";
import { useProgress } from "../useProgress";

export const Essay: React.FC = () => {
  const { bookSlug, essaySlug } = useParams<{ bookSlug: string; essaySlug: string }>();
  const book = findBook(loadBooks(), bookSlug ?? "");
  const essay = book ? findEssay(book, essaySlug ?? "") : undefined;

  const { user } = useAuth();
  const { recordProgress } = useProgress(user);

  const onProgress = useCallback(
    (frac: number) => {
      if (book && essay) recordProgress(book.slug, essay.order, frac);
    },
    [book, essay, recordProgress],
  );

  if (!book || !essay) {
    return (
      <article className="essay">
        <p>निबंध सापडला नाही. <Link to="/">मुख्य पानावर परत</Link></p>
      </article>
    );
  }

  const idx = book.essays.findIndex((e) => e.order === essay.order);
  const prev = idx > 0 ? book.essays[idx - 1] : undefined;
  const next = idx >= 0 ? book.essays[idx + 1] : undefined;

  const shareUrl = window.location.href;

  return (
    <article className="essay">
      <ReadingProgressBar onProgress={onProgress} />
      <TopBar
        backTo={`/${book.slug}`}
        backLabel={book.title}
        shareTitle={essay.title}
        shareUrl={shareUrl}
      />
      <header className="essay-header">
        <h1>{essay.title}</h1>
        <p className="essay-meta">{essay.read_time} मिनिटे</p>
      </header>
      <EssayBody body={essay.body} />
      <nav className="essay-nav">
        {prev ? (
          <Link to={`/${book.slug}/${prev.slug}`} className="essay-nav-prev">← {prev.title}</Link>
        ) : <span />}
        {next ? (
          <Link to={`/${book.slug}/${next.slug}`} className="essay-nav-next">{next.title} →</Link>
        ) : <span />}
      </nav>
      <BackToTop />
    </article>
  );
};

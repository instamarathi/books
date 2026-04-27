import { useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { findBook, findChapter, loadBooks } from "../books";
import { ChapterBody } from "../components/ChapterBody";
import { TopBar } from "../components/TopBar";
import { ReadingProgressBar } from "../components/ReadingProgressBar";
import { BackToTop } from "../components/BackToTop";
import { SignInGate } from "../components/SignInGate";
import { useAuth } from "../useAuth";
import { useProgress } from "../useProgress";

const FREE_CHAPTER_ORDER = 1;

export const Chapter = () => {
  const { bookSlug, chapterSlug } = useParams<{ bookSlug: string; chapterSlug: string }>();
  const book = findBook(loadBooks(), bookSlug ?? "");
  const chapter = book ? findChapter(book, chapterSlug ?? "") : undefined;

  const { user, loading, signIn, signOut: _signOut } = useAuth();
  void _signOut;
  const { recordProgress } = useProgress(user);

  const onProgress = useCallback(
    (frac: number) => {
      if (book && chapter) recordProgress(book.slug, chapter.order, frac);
    },
    [book, chapter, recordProgress],
  );

  if (!book || !chapter) {
    return (
      <article className="chapter">
        <p>प्रकरण सापडलं नाही. <Link to="/">मुख्य पानावर परत</Link></p>
      </article>
    );
  }

  const isLocked = !user && chapter.order > FREE_CHAPTER_ORDER;
  const shareUrl = window.location.href;

  if (isLocked) {
    return (
      <article className="chapter">
        <TopBar
          backTo={`/${book.slug}`}
          backLabel={book.title}
          shareTitle={chapter.title}
          shareUrl={shareUrl}
        />
        <SignInGate loading={loading} signIn={signIn} chapterTitle={chapter.title} />
      </article>
    );
  }

  const idx = book.chapters.findIndex((c) => c.order === chapter.order);
  const prev = idx > 0 ? book.chapters[idx - 1] : undefined;
  const next = idx >= 0 ? book.chapters[idx + 1] : undefined;

  return (
    <article className="chapter">
      <ReadingProgressBar onProgress={onProgress} />
      <TopBar
        backTo={`/${book.slug}`}
        backLabel={book.title}
        shareTitle={chapter.title}
        shareUrl={shareUrl}
      />
      <header className="chapter-header">
        <h1>{chapter.title}</h1>
        <p className="chapter-meta">{chapter.read_time} मिनिटे</p>
      </header>
      <ChapterBody body={chapter.body} />
      <nav className="chapter-nav">
        {prev ? (
          <Link to={`/${book.slug}/${prev.slug}`} className="chapter-nav-prev">← {prev.title}</Link>
        ) : <span />}
        {next ? (
          <Link to={`/${book.slug}/${next.slug}`} className="chapter-nav-next">{next.title} →</Link>
        ) : <span />}
      </nav>
      <BackToTop />
    </article>
  );
};

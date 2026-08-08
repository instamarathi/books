import { useParams, Link } from "react-router-dom";
import { bookLanguage, findBook, findChapter, loadBooks, readTimeLabel } from "../books";
import { ChapterBody } from "../components/ChapterBody";
import { TopBar } from "../components/TopBar";
import { ReadingProgressBar } from "../components/ReadingProgressBar";
import { BackToTop } from "../components/BackToTop";
import { chapterArtUrl } from "../chapterArt";

export const Chapter = () => {
  const { bookSlug, chapterSlug } = useParams<{ bookSlug: string; chapterSlug: string }>();
  const book = findBook(loadBooks(), bookSlug ?? "");
  const chapter = book ? findChapter(book, chapterSlug ?? "") : undefined;
  const language = book ? bookLanguage(book) : bookLanguage({ slug: bookSlug ?? "" });

  if (!book || !chapter) {
    return (
      <article className={`chapter reading-page-shell ${language === "marathi" ? "reading-page-shell-marathi" : "reading-page-shell-english"}`}>
        <p>
          {language === "marathi" ? "प्रकरण सापडलं नाही." : "Chapter not found."}{" "}
          <Link to="/">{language === "marathi" ? "मुख्य पानावर परत" : "Back to home"}</Link>
        </p>
      </article>
    );
  }

  const art = chapterArtUrl(book.slug, chapter.slug);

  const idx = book.chapters.findIndex((c) => c.order === chapter.order);
  const prev = idx > 0 ? book.chapters[idx - 1] : undefined;
  const next = idx >= 0 ? book.chapters[idx + 1] : undefined;

  return (
    <article className={`chapter reading-page-shell ${language === "marathi" ? "reading-page-shell-marathi" : "reading-page-shell-english"}`}>
      <ReadingProgressBar />
      <TopBar backTo={`/${book.slug}`} backLabel={book.title} />
      <header className="chapter-header">
        <h1>{chapter.title}</h1>
        <p className="chapter-meta">{readTimeLabel(book, chapter.read_time)}</p>
      </header>
      {art && (
        <figure className="chapter-art">
          <img src={art} alt="" className="chapter-art-image" loading="eager" />
        </figure>
      )}
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

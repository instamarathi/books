import React, { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { AuthWidget } from "./components/AuthWidget";
import { ThemeToggle } from "./components/ThemeToggle";
import { FontSizeToggle } from "./components/FontSizeToggle";
import { ShareButton } from "./components/ShareButton";
import { useAuth } from "./useAuth";
import { Bookshelf } from "./pages/Bookshelf";
import { BookIndex } from "./pages/BookIndex";
import { Chapter } from "./pages/Chapter";
import { PrintBook } from "./pages/PrintBook";

export const App: React.FC = () => {
  const { user, loading, signIn, signOut } = useAuth();
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  const shareUrl = window.location.origin + location.pathname;
  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-title">
          <img src={`${import.meta.env.BASE_URL}logo-192.png`} alt="instamarathi books" className="site-logo" />
        </Link>
        <div className="site-header-actions">
          <FontSizeToggle />
          <ThemeToggle />
          <ShareButton title="instamarathi books" url={shareUrl} />
          <AuthWidget user={user} loading={loading} signIn={signIn} signOut={signOut} compact />
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Bookshelf />} />
          <Route path="/print/:bookSlug" element={<PrintBook />} />
          <Route path="/:bookSlug" element={<BookIndex />} />
          <Route path="/:bookSlug/:chapterSlug" element={<Chapter />} />
          <Route path="*" element={<p>पृष्ठ सापडले नाही.</p>} />
        </Routes>
      </main>
      <footer className="site-footer">
        © {new Date().getFullYear()} instamarathi. सर्व हक्क राखीव.
      </footer>
    </>
  );
};

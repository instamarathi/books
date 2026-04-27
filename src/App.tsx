import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AuthWidget } from "./components/AuthWidget";
import { ThemeToggle } from "./components/ThemeToggle";
import { FontSizeToggle } from "./components/FontSizeToggle";
import { useAuth } from "./useAuth";
import { Bookshelf } from "./pages/Bookshelf";
import { BookIndex } from "./pages/BookIndex";
import { Essay } from "./pages/Essay";

export const App: React.FC = () => {
  const { user, loading, signIn, signOut } = useAuth();
  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-title">instamarathi books</Link>
        <div className="site-header-actions">
          <FontSizeToggle />
          <ThemeToggle />
          <AuthWidget user={user} loading={loading} signIn={signIn} signOut={signOut} compact />
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Bookshelf />} />
          <Route path="/:bookSlug" element={<BookIndex />} />
          <Route path="/:bookSlug/:essaySlug" element={<Essay />} />
          <Route path="*" element={<p>पृष्ठ सापडले नाही.</p>} />
        </Routes>
      </main>
    </>
  );
};

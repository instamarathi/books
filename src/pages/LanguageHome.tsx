import { Link } from "react-router-dom";

export const LanguageHome = () => {
  return (
    <section className="language-home" aria-labelledby="language-home-title">
      <div className="language-home-panel">
        <p className="language-home-eyebrow">Choose your shelf</p>
        <h1 id="language-home-title">Marathi or English?</h1>
        <p className="language-home-copy">
          Pick the language you want to read in. Marathi opens the full Marathi bookshelf.
          English takes you to the English edition shelf.
        </p>
        <div className="language-home-actions">
          <Link to="/marathi" className="language-home-card" aria-label="Marathi books">
            <span className="language-home-label">Marathi</span>
            <span className="language-home-subtitle">मराठी पुस्तकं</span>
          </Link>
          <Link to="/english" className="language-home-card" aria-label="English books">
            <span className="language-home-label">English</span>
            <span className="language-home-subtitle">English books</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

import { Link } from "react-router-dom";

export const LanguageHome = () => {
  return (
    <section className="language-home" aria-labelledby="language-home-title">
      <div className="language-home-panel">
        <p className="language-home-eyebrow">Choose your shelf</p>
        <h1 id="language-home-title">What would you like to read?</h1>
        <p className="language-home-copy">
          Pick a shelf. Each edition is written for its language and context—not mechanically translated.
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
          <Link to="/hinglish" className="language-home-card" aria-label="Hinglish books">
            <span className="language-home-label">Hinglish</span>
            <span className="language-home-subtitle">Hindi dil, Roman script</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

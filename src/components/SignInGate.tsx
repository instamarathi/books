import type { User } from "firebase/auth";
import { GoogleIcon } from "../icons";
import type { BookLanguage } from "../books";

export const SignInGate = ({
  loading,
  signIn,
  chapterTitle,
  language = "marathi",
}: {
  loading: boolean;
  signIn: () => void;
  chapterTitle: string;
  language?: BookLanguage;
  user?: User | null;
}) => {
  if (loading) {
    return (
      <div className="signin-gate">
        <p className="signin-gate-loading">Loading…</p>
      </div>
    );
  }
  return (
    <div className="signin-gate">
      <h2 className="signin-gate-title">{chapterTitle}</h2>
      <p className="signin-gate-msg">
        {language === "english"
          ? "The first chapter is open to everyone. Sign in to read the rest — one click, no extra setup."
          : "पहिलं प्रकरण सर्वांसाठी खुलं आहे. पुढची वाचण्यासाठी sign in करा — एका click मध्ये, कोणताही extra setup नाही."}
      </p>
      <button className="signin-gate-btn" onClick={signIn}>
        <GoogleIcon /> {language === "english" ? "Sign in to read" : "वाचण्यासाठी sign in करा"}
      </button>
      <p className="signin-gate-note">
        {language === "english"
          ? "Signing in saves your progress and tracks your streak."
          : "Sign in केल्यावर तुमची progress save होते आणि streak track होतो."}
      </p>
    </div>
  );
};

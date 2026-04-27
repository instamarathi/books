import type { User } from "firebase/auth";
import { GoogleIcon } from "../icons";

export const SignInGate = ({
  loading,
  signIn,
  essayTitle,
}: {
  loading: boolean;
  signIn: () => void;
  essayTitle: string;
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
      <h2 className="signin-gate-title">{essayTitle}</h2>
      <p className="signin-gate-msg">
        पहिला निबंध सर्वांसाठी खुला आहे. पुढचे वाचण्यासाठी sign in करा — एका
        click मध्ये, कोणताही extra setup नाही.
      </p>
      <button className="signin-gate-btn" onClick={signIn}>
        <GoogleIcon /> Sign in to read
      </button>
      <p className="signin-gate-note">
        Sign in केल्यावर तुमची progress save होते आणि streak track होतो.
      </p>
    </div>
  );
};

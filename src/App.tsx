import React from "react";
import { AuthWidget } from "./components/AuthWidget";
import { ThemeToggle } from "./components/ThemeToggle";
import { useAuth } from "./useAuth";

export const App: React.FC = () => {
  const { user, loading, signIn, signOut } = useAuth();
  return (
    <main>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>instamarathi books</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <ThemeToggle />
          <AuthWidget user={user} loading={loading} signIn={signIn} signOut={signOut} compact />
        </div>
      </header>
    </main>
  );
};

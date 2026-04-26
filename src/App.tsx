import React from "react";
import { AuthWidget } from "./components/AuthWidget";
import { useAuth } from "./useAuth";

export const App: React.FC = () => {
  const { user, loading, signIn, signOut } = useAuth();
  return (
    <main>
      <h1>instamarathi books</h1>
      <AuthWidget user={user} loading={loading} signIn={signIn} signOut={signOut} compact />
    </main>
  );
};

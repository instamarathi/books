import React from "react";
import { useParams } from "react-router-dom";

export const Essay: React.FC = () => {
  const { bookSlug, essaySlug } = useParams<{ bookSlug: string; essaySlug: string }>();
  return (
    <article className="essay">
      <h2>Essay: {bookSlug} / {essaySlug}</h2>
      <p>(essay body goes here)</p>
    </article>
  );
};

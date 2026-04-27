import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../App";

describe("App routing", () => {
  it("renders Bookshelf at /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /पुस्तके/i })).toBeInTheDocument();
  });

  it("renders BookIndex at /:bookSlug", () => {
    render(
      <MemoryRouter initialEntries={["/how-to-talk"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /मुलांशी कसं बोलावं/ })).toBeInTheDocument();
  });

  it("renders Essay at /:bookSlug/:essaySlug", () => {
    render(
      <MemoryRouter initialEntries={["/how-to-talk/01-feelings"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Essay: how-to-talk \/ 01-feelings/)).toBeInTheDocument();
  });
});

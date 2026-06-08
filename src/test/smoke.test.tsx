import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../App";

describe("App routing", () => {
  it("renders the language chooser at /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /^Marathi books$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^English books$/i })).toBeInTheDocument();
  });

  it("renders the Marathi bookshelf at /marathi", () => {
    render(
      <MemoryRouter initialEntries={["/marathi"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /कारकीर्द/i })).toBeInTheDocument();
    expect(screen.getAllByText(/वाचून होत नाही/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Midlife Redesign/i)).not.toBeInTheDocument();
  });

  it("renders the English bookshelf at /english", () => {
    render(
      <MemoryRouter initialEntries={["/english"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getAllByText(/Midlife Redesign/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/वाचून होत नाही/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Mindset/i })).toBeInTheDocument();
    expect(screen.getByText(/Start reading/i)).toBeInTheDocument();
    expect(screen.queryByText(/आत्म-विकास/)).not.toBeInTheDocument();
    expect(screen.queryByText(/प्रकरणं/)).not.toBeInTheDocument();
  });

  it("renders BookIndex at /:bookSlug", () => {
    render(
      <MemoryRouter initialEntries={["/vachun-hot-nahi"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /वाचून होत नाही/ })).toBeInTheDocument();
    expect(
      screen.queryByLabelText("प्रकरणांचं चित्रमय preview"),
    ).not.toBeInTheDocument();
  });

  it("renders Chapter at /:bookSlug/:chapterSlug", () => {
    render(
      <MemoryRouter initialEntries={["/how-to-talk/does-not-exist"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText(/प्रकरण सापडलं नाही/)).toBeInTheDocument();
  });
});

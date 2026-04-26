# instamarathi books — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `instamarathi/books` site — a Vite + React + TypeScript SPA on GitHub Pages that hosts the first book (9 essays) with Google sign-in, per-essay reading-progress tracking via Firestore, light/dark theming, font-size control, and per-essay OG cards for WhatsApp/Telegram sharing.

**Architecture:** Vite + React 18 + TypeScript SPA, path-based routing, Firestore for user data (reusing the existing carousels Firebase project). Essays are Markdown files loaded via `import.meta.glob` and rendered with `react-markdown`. A build-time post-process injects per-essay OG meta tags into static HTML stubs and generates 1200×630 OG-card PNGs. GitHub Actions deploys `dist/` to Pages at `https://instamarathi.github.io/books/`.

**Tech Stack:** Vite 5, React 18, TypeScript 5, Vitest + @testing-library/react for tests, react-router-dom v6, react-markdown + remark-gfm + gray-matter, satori + sharp for OG cards, Firebase Auth + Firestore.

**Scope of this plan:** Site framework end-to-end, **plus essay 1** as the smoke-test essay so the full pipeline is exercised. Essays 2–9 are pure content drops written after this plan ships and do not need separate plan tasks — they are new `.md` files added to `books/how-to-talk/` and a `git push`. The plan ends after a successful production-build smoke check; the actual repo-create + first deploy to GitHub Pages is a small manual step the user does once.

**Reference codebase:** `/Users/anup/claude_tmp/carousels` (sibling project) — many files are copied directly. Where copy-then-adapt is required, the adaptations are spelled out per task.

**Spec reference:** `docs/superpowers/specs/2026-04-26-instamarathi-books-design.md` (in this repo).

---

## File Structure

This plan creates and modifies the files below. Each file has one clear responsibility.

```
package.json                                 npm scripts, deps
tsconfig.json                                TS config
vite.config.ts                               Vite config, base /books/
vitest.config.ts                             Vitest config
.gitignore                                   node_modules, dist, .env
index.html                                   site shell
404.html                                     SPA fallback for unknown routes
firestore.rules                              Firestore security (copied from carousels)
.github/workflows/deploy.yml                 GitHub Pages CI
public/
  favicon.svg
  apple-touch-icon.png
  robots.txt
src/
  main.tsx                                   ReactDOM.createRoot entry
  App.tsx                                    routes + global providers
  firebase.ts                                Firebase init (copied from carousels)
  useAuth.ts                                 auth hook (copied from carousels)
  useProgress.ts                             progress hook (adapted for book/essay shape)
  useTheme.ts                                light/dark/system theme hook
  useFontSize.ts                             A-/A/A+ font-size hook
  books.ts                                   Markdown loader + book/essay types
  icons.tsx                                  inline SVG icons (copied from carousels)
  styles.css                                 all styles (CSS variables for theming)
  components/
    AuthWidget.tsx                           sign-in button (copied from carousels)
    ThemeToggle.tsx                          sun/moon button
    FontSizeToggle.tsx                       A-/A/A+ controls
    ShareButton.tsx                          Web Share API + clipboard fallback
    ReadingProgressBar.tsx                   thin top bar that fills as user scrolls
    BackToTop.tsx                            floating button after 30% scroll
    QuickRefCard.tsx                         styled wrapper for the bottom of essays
    TopBar.tsx                               sticky top bar on essay page
  pages/
    Bookshelf.tsx                            home: list of books
    BookIndex.tsx                            book landing: essay list + credit
    Essay.tsx                                essay reader, drives progress tracking
  test/
    setup.ts                                 Vitest setup (jsdom, testing-library)
books/
  how-to-talk/
    meta.json                                book metadata
    01-feelings.md                           essay 1 (smoke-test essay)
scripts/
  generate-og-cards.ts                       build-time per-essay PNG generator
  generate-static-html.ts                    build-time per-essay OG-tagged HTML stub
  generate-sitemap.ts                        build-time sitemap.xml
```

---

## Task 1: Project scaffold (Vite + React + TS + Vitest)

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `.gitignore`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles.css`, `src/test/setup.ts`, `src/test/smoke.test.tsx`

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "books",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build && tsx scripts/generate-og-cards.ts && tsx scripts/generate-static-html.ts && tsx scripts/generate-sitemap.ts",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "firebase": "^12.12.1",
    "gray-matter": "^4.0.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-markdown": "^9.0.1",
    "react-router-dom": "^6.28.0",
    "remark-gfm": "^4.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.1",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "resvg-js": "^2.6.2",
    "satori": "^0.11.3",
    "tsx": "^4.19.2",
    "typescript": "^5.6.3",
    "vite": "^5.4.11",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vite/client", "@testing-library/jest-dom"]
  },
  "include": ["src", "scripts"]
}
```

- [ ] **Step 3: Write `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// For GitHub Pages, served from /<repo>/. CI sets VITE_BASE=/books/.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? "/",
  publicDir: "public",
  server: { port: 5173, open: true },
});
```

- [ ] **Step 4: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
});
```

- [ ] **Step 5: Write `.gitignore`**

```
node_modules/
dist/
.env
.DS_Store
*.local
```

- [ ] **Step 6: Write `index.html`**

```html
<!doctype html>
<html lang="mr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#FAF7F2" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#1A1A1C" media="(prefers-color-scheme: dark)" />
    <title>instamarathi books</title>
    <meta name="description" content="मराठी निबंधांचे संग्रह — मोबाईलसाठी." />
    <meta property="og:site_name" content="instamarathi books" />
    <meta property="og:locale" content="mr_IN" />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Tiro+Devanagari+Marathi:ital@0;1&display=swap"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Write `src/main.tsx`**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./styles.css";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={base || "/"}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

- [ ] **Step 8: Write `src/App.tsx` stub**

```tsx
import React from "react";

export const App: React.FC = () => {
  return (
    <main>
      <h1>instamarathi books</h1>
      <p>Loading…</p>
    </main>
  );
};
```

- [ ] **Step 9: Write `src/styles.css` (minimal placeholder)**

```css
:root {
  --bg: #FAF7F2;
  --fg: #1F1B16;
  --accent: #C76C2D;
}
body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: "Tiro Devanagari Marathi", "Inter", system-ui, sans-serif;
}
main {
  padding: 1rem;
}
```

- [ ] **Step 10: Write `src/test/setup.ts`**

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 11: Write smoke test `src/test/smoke.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../App";

describe("App", () => {
  it("renders the site title", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /instamarathi books/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 12: Install deps and run test**

Run: `npm install && npm test`
Expected: 1 test passes ("renders the site title").

- [ ] **Step 13: Verify dev server starts**

Run: `npm run dev` and open the URL. Expected: page shows "instamarathi books" header. Stop the dev server (Ctrl+C).

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "scaffold: Vite + React + TS + Vitest"
```

---

## Task 2: Firebase init and auth hook (copied from carousels)

**Files:**
- Create: `src/firebase.ts`, `src/useAuth.ts`, `src/icons.tsx`, `src/components/AuthWidget.tsx`

These four files are copied verbatim from `/Users/anup/claude_tmp/carousels/src/`. The Firebase config is intentionally identical — same project, same auth domain, same user collection.

- [ ] **Step 1: Copy `firebase.ts` from carousels**

Run: `cp /Users/anup/claude_tmp/carousels/src/firebase.ts src/firebase.ts`

Verify the file matches (it should contain `projectId: "carousel-2a740"` and exports `auth`, `db`).

- [ ] **Step 2: Copy `useAuth.ts` from carousels**

Run: `cp /Users/anup/claude_tmp/carousels/src/useAuth.ts src/useAuth.ts`

- [ ] **Step 3: Copy `icons.tsx` from carousels**

Run: `cp /Users/anup/claude_tmp/carousels/src/icons.tsx src/icons.tsx`

- [ ] **Step 4: Copy `AuthWidget.tsx` from carousels into components/**

Run: `mkdir -p src/components && cp /Users/anup/claude_tmp/carousels/src/AuthWidget.tsx src/components/AuthWidget.tsx`

- [ ] **Step 5: Fix the `icons` import in `AuthWidget.tsx`**

The carousels copy imports from `./icons`; in the new layout `icons.tsx` lives one level up. Edit `src/components/AuthWidget.tsx`:

Change:
```ts
import { GoogleIcon } from "./icons";
```
to:
```ts
import { GoogleIcon } from "../icons";
```

- [ ] **Step 6: Wire AuthWidget into App and verify build**

Replace `src/App.tsx` body with:

```tsx
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
```

- [ ] **Step 7: Run tests and dev server**

Run: `npm test`
Expected: smoke test still passes.

Run: `npm run dev`
Expected: page renders with a "Sign in" button. Click it — Google popup appears (will fail to complete unless `localhost:5173` is in Firebase authorized domains; for local testing it usually is from the carousels project). Sign-in success is not required for the test to pass — we just want the button rendered without errors. Stop dev server.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "auth: copy firebase + useAuth + AuthWidget from carousels"
```

---

## Task 3: Theme system (light/dark/system + toggle)

**Files:**
- Create: `src/useTheme.ts`, `src/components/ThemeToggle.tsx`, `src/useTheme.test.ts`
- Modify: `src/styles.css` (add CSS variables for both modes)

- [ ] **Step 1: Write failing test `src/useTheme.test.ts`**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to system when no preference is stored", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("system");
  });

  it("loads stored preference", () => {
    localStorage.setItem("theme", "dark");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("setTheme updates state, localStorage, and the data-theme attr", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("dark"));
    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("system mode does not set the data-theme attr (CSS handles it)", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("dark"));
    act(() => result.current.setTheme("system"));
    expect(document.documentElement.getAttribute("data-theme")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- useTheme`
Expected: FAIL — `Cannot find module './useTheme'`.

- [ ] **Step 3: Write `src/useTheme.ts`**

```ts
import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function readStored(): Theme {
  const v = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  return v === "light" || v === "dark" || v === "system" ? v : "system";
}

function applyToDocument(theme: Theme) {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readStored);

  useEffect(() => {
    applyToDocument(theme);
  }, [theme]);

  const setTheme = (t: Theme) => {
    localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
  };

  return { theme, setTheme };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- useTheme`
Expected: PASS — 4 tests.

- [ ] **Step 5: Update `src/styles.css` with full color tokens**

Replace the `:root` block and append a dark block:

```css
:root {
  --bg: #FAF7F2;
  --fg: #1F1B16;
  --fg-muted: #6B6359;
  --accent: #C76C2D;
  --card-bg: #FFFFFF;
  --border: #E8E0D5;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1A1A1C;
    --fg: #E8E4DD;
    --fg-muted: #9A938A;
    --accent: #E08A4F;
    --card-bg: #232326;
    --border: #2E2D2F;
  }
}

:root[data-theme="light"] {
  --bg: #FAF7F2;
  --fg: #1F1B16;
  --fg-muted: #6B6359;
  --accent: #C76C2D;
  --card-bg: #FFFFFF;
  --border: #E8E0D5;
}

:root[data-theme="dark"] {
  --bg: #1A1A1C;
  --fg: #E8E4DD;
  --fg-muted: #9A938A;
  --accent: #E08A4F;
  --card-bg: #232326;
  --border: #2E2D2F;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: "Tiro Devanagari Marathi", "Inter", system-ui, sans-serif;
  font-size: var(--body-size, 18px);
  line-height: 1.7;
}
```

- [ ] **Step 6: Write `src/components/ThemeToggle.tsx`**

```tsx
import React from "react";
import { useTheme, type Theme } from "../useTheme";

const NEXT: Record<Theme, Theme> = { system: "light", light: "dark", dark: "system" };
const LABEL: Record<Theme, string> = { system: "Auto", light: "Light", dark: "Dark" };
const ICON: Record<Theme, string> = { system: "🌗", light: "☀", dark: "🌙" };

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(NEXT[theme])}
      aria-label={`Theme: ${LABEL[theme]}. Click to cycle.`}
      title={`Theme: ${LABEL[theme]}`}
    >
      {ICON[theme]}
    </button>
  );
};
```

- [ ] **Step 7: Add toggle styling to `styles.css`**

Append:

```css
.theme-toggle, .font-size-toggle button {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--fg);
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  font: inherit;
  cursor: pointer;
}
.theme-toggle:hover, .font-size-toggle button:hover {
  background: var(--card-bg);
}
```

- [ ] **Step 8: Wire ThemeToggle into App**

Replace `src/App.tsx`:

```tsx
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
```

- [ ] **Step 9: Run tests + visual check**

Run: `npm test`
Expected: all tests pass (smoke + 4 theme tests).

Run: `npm run dev`. Click the theme toggle three times to cycle through Auto → Light → Dark → Auto. Verify background color changes.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "theme: light/dark/system toggle with CSS variables"
```

---

## Task 4: Font-size system (A-/A/A+)

**Files:**
- Create: `src/useFontSize.ts`, `src/components/FontSizeToggle.tsx`, `src/useFontSize.test.ts`
- Modify: `src/styles.css` (use `--body-size`)

- [ ] **Step 1: Write failing test `src/useFontSize.test.ts`**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFontSize } from "./useFontSize";

describe("useFontSize", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.removeProperty("--body-size");
  });

  it("defaults to medium (18px)", () => {
    const { result } = renderHook(() => useFontSize());
    expect(result.current.size).toBe("medium");
    expect(document.documentElement.style.getPropertyValue("--body-size")).toBe("18px");
  });

  it("loads stored size", () => {
    localStorage.setItem("font-size", "large");
    const { result } = renderHook(() => useFontSize());
    expect(result.current.size).toBe("large");
    expect(document.documentElement.style.getPropertyValue("--body-size")).toBe("20px");
  });

  it("setSize updates state, localStorage, and the CSS variable", () => {
    const { result } = renderHook(() => useFontSize());
    act(() => result.current.setSize("small"));
    expect(result.current.size).toBe("small");
    expect(localStorage.getItem("font-size")).toBe("small");
    expect(document.documentElement.style.getPropertyValue("--body-size")).toBe("16px");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- useFontSize`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/useFontSize.ts`**

```ts
import { useEffect, useState } from "react";

export type FontSize = "small" | "medium" | "large";

const PX: Record<FontSize, string> = { small: "16px", medium: "18px", large: "20px" };
const STORAGE_KEY = "font-size";

function readStored(): FontSize {
  const v = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  return v === "small" || v === "medium" || v === "large" ? v : "medium";
}

export function useFontSize() {
  const [size, setSizeState] = useState<FontSize>(readStored);

  useEffect(() => {
    document.documentElement.style.setProperty("--body-size", PX[size]);
  }, [size]);

  const setSize = (s: FontSize) => {
    localStorage.setItem(STORAGE_KEY, s);
    setSizeState(s);
  };

  return { size, setSize };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- useFontSize`
Expected: PASS — 3 tests.

- [ ] **Step 5: Write `src/components/FontSizeToggle.tsx`**

```tsx
import React from "react";
import { useFontSize, type FontSize } from "../useFontSize";

const SIZES: FontSize[] = ["small", "medium", "large"];
const LABEL: Record<FontSize, string> = { small: "A-", medium: "A", large: "A+" };

export const FontSizeToggle: React.FC = () => {
  const { size, setSize } = useFontSize();
  return (
    <div className="font-size-toggle" role="group" aria-label="Font size">
      {SIZES.map((s) => (
        <button
          key={s}
          onClick={() => setSize(s)}
          aria-pressed={size === s}
          className={size === s ? "active" : ""}
        >
          {LABEL[s]}
        </button>
      ))}
    </div>
  );
};
```

- [ ] **Step 6: Style the toggle group in `styles.css`**

Append:

```css
.font-size-toggle {
  display: inline-flex;
  gap: 0.25rem;
}
.font-size-toggle button.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}
```

- [ ] **Step 7: Run tests**

Run: `npm test`
Expected: all 8 tests pass.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "font-size: A-/A/A+ toggle with CSS variable"
```

---

## Task 5: Routing skeleton with stub pages

**Files:**
- Create: `src/pages/Bookshelf.tsx`, `src/pages/BookIndex.tsx`, `src/pages/Essay.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write `src/pages/Bookshelf.tsx` stub**

```tsx
import React from "react";

export const Bookshelf: React.FC = () => {
  return (
    <section className="bookshelf">
      <h2>पुस्तके</h2>
      <p>(books list goes here)</p>
    </section>
  );
};
```

- [ ] **Step 2: Write `src/pages/BookIndex.tsx` stub**

```tsx
import React from "react";
import { useParams } from "react-router-dom";

export const BookIndex: React.FC = () => {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  return (
    <section className="book-index">
      <h2>Book: {bookSlug}</h2>
      <p>(essay list goes here)</p>
    </section>
  );
};
```

- [ ] **Step 3: Write `src/pages/Essay.tsx` stub**

```tsx
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
```

- [ ] **Step 4: Update `src/App.tsx` to use Routes**

```tsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AuthWidget } from "./components/AuthWidget";
import { ThemeToggle } from "./components/ThemeToggle";
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
          <ThemeToggle />
          <AuthWidget user={user} loading={loading} signIn={signIn} signOut={signOut} compact />
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Bookshelf />} />
          <Route path="/:bookSlug" element={<BookIndex />} />
          <Route path="/:bookSlug/:essaySlug" element={<Essay />} />
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </main>
    </>
  );
};
```

- [ ] **Step 5: Add header layout styles to `styles.css`**

Append:

```css
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
}
.site-title {
  font-weight: 600;
  text-decoration: none;
  color: var(--fg);
  font-size: 1.1rem;
}
.site-header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
main {
  max-width: 640px;
  margin: 0 auto;
  padding: 1rem;
}
```

- [ ] **Step 6: Update smoke test to assert routing**

Replace `src/test/smoke.test.tsx` body:

```tsx
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
    expect(screen.getByText(/Book: how-to-talk/)).toBeInTheDocument();
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
```

- [ ] **Step 7: Run tests**

Run: `npm test`
Expected: all tests pass (3 routing tests + theme + font-size = 10 total).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "routing: react-router with Bookshelf/BookIndex/Essay stub pages"
```

---

## Task 6: Books data layer (Markdown loader + types)

**Files:**
- Create: `src/books.ts`, `src/books.test.ts`, `books/how-to-talk/meta.json`, plus three temporary fixture files for testing.

- [ ] **Step 1: Create the book metadata file**

Create `books/how-to-talk/meta.json`:

```json
{
  "slug": "how-to-talk",
  "title": "मुलांशी कसं बोलावं",
  "subtitle": "Practical communication for Marathi parents (kids 2–12)",
  "credit": "हे निबंध जनसामान्य पालकत्व-विचारांवर आधारित आहेत, मराठी कुटुंबांच्या context साठी पुन्हा लिहिलेले.",
  "essay_order": [
    "01-feelings",
    "02-cooperation",
    "03-no-punishment",
    "04-autonomy",
    "05-praise",
    "06-labels",
    "07-siblings",
    "08-screens",
    "09-pitfalls"
  ]
}
```

Note: the `credit` text above is a generic placeholder that does not name a specific source book. The user will edit this text once before deploying if a specific attribution is desired.

- [ ] **Step 2: Write failing test `src/books.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { parseEssay } from "./books";

describe("parseEssay", () => {
  it("extracts frontmatter and body from raw markdown", () => {
    const raw = `---
title: Test Title
slug: 01-test
order: 1
summary: A short summary
read_time: 5
---

# Body heading

Body paragraph.
`;
    const essay = parseEssay(raw, "how-to-talk", "01-test");
    expect(essay.title).toBe("Test Title");
    expect(essay.slug).toBe("01-test");
    expect(essay.order).toBe(1);
    expect(essay.summary).toBe("A short summary");
    expect(essay.read_time).toBe(5);
    expect(essay.body).toContain("# Body heading");
    expect(essay.body).toContain("Body paragraph.");
    expect(essay.body).not.toContain("---");
    expect(essay.bookSlug).toBe("how-to-talk");
  });

  it("falls back to first paragraph when summary missing", () => {
    const raw = `---
title: T
slug: s
order: 1
read_time: 5
---

This is the first paragraph that should become the summary if no explicit summary is provided.

Second paragraph.
`;
    const essay = parseEssay(raw, "b", "s");
    expect(essay.summary.startsWith("This is the first paragraph")).toBe(true);
  });

  it("throws when frontmatter is missing required fields", () => {
    const raw = `---
title: only title
---

body
`;
    expect(() => parseEssay(raw, "b", "s")).toThrow(/missing required field/i);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- books`
Expected: FAIL — `Cannot find module './books'`.

- [ ] **Step 4: Write `src/books.ts`**

```ts
import matter from "gray-matter";

export type Essay = {
  bookSlug: string;
  slug: string;
  title: string;
  order: number;
  summary: string;
  read_time: number;
  body: string;
};

export type BookMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  credit?: string;
  essay_order: string[];
};

export type Book = BookMeta & {
  essays: Essay[];
};

const REQUIRED = ["title", "slug", "order", "read_time"] as const;

function firstParagraph(body: string, max = 160): string {
  const trimmed = body.trim();
  const para = trimmed.split(/\n\s*\n/)[0] ?? "";
  const cleaned = para.replace(/[#>*_`]/g, "").trim();
  return cleaned.length > max ? cleaned.slice(0, max - 1) + "…" : cleaned;
}

export function parseEssay(raw: string, bookSlug: string, fallbackSlug: string): Essay {
  const { data, content } = matter(raw);
  for (const field of REQUIRED) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      throw new Error(`Essay ${bookSlug}/${fallbackSlug}: missing required field "${field}"`);
    }
  }
  return {
    bookSlug,
    slug: String(data.slug ?? fallbackSlug),
    title: String(data.title),
    order: Number(data.order),
    read_time: Number(data.read_time),
    summary: data.summary ? String(data.summary) : firstParagraph(content),
    body: content,
  };
}

// Eager glob: load all book metadata and all essay markdown at module load.
// Vite resolves these at build time and bundles them.
const metaModules = import.meta.glob("/books/*/meta.json", {
  eager: true,
  import: "default",
}) as Record<string, BookMeta>;

const rawEssayModules = import.meta.glob("/books/*/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function pathParts(filePath: string): { bookSlug: string; essaySlug: string } {
  // filePath is like "/books/how-to-talk/01-feelings.md"
  const parts = filePath.split("/");
  return {
    bookSlug: parts[2] ?? "",
    essaySlug: (parts[3] ?? "").replace(/\.md$/, ""),
  };
}

export function loadBooks(): Book[] {
  const books: Book[] = [];
  for (const [path, meta] of Object.entries(metaModules)) {
    const bookSlug = path.split("/")[2] ?? "";
    const essays: Essay[] = [];
    for (const [essayPath, raw] of Object.entries(rawEssayModules)) {
      const parts = pathParts(essayPath);
      if (parts.bookSlug !== bookSlug) continue;
      essays.push(parseEssay(raw, bookSlug, parts.essaySlug));
    }
    essays.sort((a, b) => a.order - b.order);
    books.push({ ...meta, essays });
  }
  books.sort((a, b) => a.title.localeCompare(b.title));
  return books;
}

export function findBook(books: Book[], bookSlug: string): Book | undefined {
  return books.find((b) => b.slug === bookSlug);
}

export function findEssay(book: Book, essaySlug: string): Essay | undefined {
  return book.essays.find((e) => e.slug === essaySlug);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- books`
Expected: PASS — 3 tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "books: Markdown loader, frontmatter parser, types"
```

---

## Task 7: Bookshelf and BookIndex pages (real content)

**Files:**
- Modify: `src/pages/Bookshelf.tsx`, `src/pages/BookIndex.tsx`
- Modify: `src/styles.css` (book card + essay row styles)
- Note: Essay 1 markdown is created in Task 11. Until then these pages render with an empty essay list, which is fine — the smoke tests in Task 5 still pass for the routes; we add light coverage here too.

- [ ] **Step 1: Replace `src/pages/Bookshelf.tsx`**

```tsx
import React from "react";
import { Link } from "react-router-dom";
import { loadBooks } from "../books";

export const Bookshelf: React.FC = () => {
  const books = loadBooks();
  return (
    <section className="bookshelf">
      <h2>पुस्तके</h2>
      {books.length === 0 ? (
        <p>(अजून पुस्तके नाहीत.)</p>
      ) : (
        <ul className="book-list">
          {books.map((b) => (
            <li key={b.slug} className="book-card">
              <Link to={`/${b.slug}`}>
                <h3>{b.title}</h3>
                {b.subtitle && <p className="book-subtitle">{b.subtitle}</p>}
                <span className="book-meta">
                  {b.essays.length} निबंध
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
```

- [ ] **Step 2: Replace `src/pages/BookIndex.tsx`**

```tsx
import React from "react";
import { Link, useParams } from "react-router-dom";
import { findBook, loadBooks } from "../books";

export const BookIndex: React.FC = () => {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  const book = findBook(loadBooks(), bookSlug ?? "");

  if (!book) {
    return <p>पुस्तक सापडले नाही.</p>;
  }

  return (
    <section className="book-index">
      <h2>{book.title}</h2>
      {book.subtitle && <p className="book-subtitle">{book.subtitle}</p>}
      {book.credit && <p className="book-credit">{book.credit}</p>}
      <ol className="essay-list">
        {book.essays.map((e) => (
          <li key={e.slug} className="essay-row">
            <Link to={`/${book.slug}/${e.slug}`}>
              <span className="essay-number">{e.order}.</span>
              <span className="essay-title">{e.title}</span>
              <span className="essay-meta">{e.read_time} मि</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};
```

- [ ] **Step 3: Add styles to `styles.css`**

Append:

```css
.book-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1rem;
}
.book-card a {
  display: block;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--fg);
  text-decoration: none;
}
.book-card h3 {
  margin: 0 0 0.25rem 0;
}
.book-subtitle {
  color: var(--fg-muted);
  margin: 0.25rem 0;
}
.book-meta {
  color: var(--fg-muted);
  font-size: 0.9em;
}
.book-credit {
  color: var(--fg-muted);
  font-style: italic;
  font-size: 0.95em;
  border-left: 3px solid var(--border);
  padding-left: 0.75rem;
}
.essay-list {
  list-style: none;
  padding: 0;
}
.essay-row a {
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
  color: var(--fg);
  text-decoration: none;
}
.essay-row a:hover {
  background: var(--card-bg);
}
.essay-number {
  color: var(--fg-muted);
}
.essay-meta {
  color: var(--fg-muted);
  font-size: 0.85em;
  align-self: center;
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: existing tests still pass. The `BookIndex` smoke test from Task 5 will now show "पुस्तक सापडले नाही." because there's no book with that slug yet — update the assertion:

Edit `src/test/smoke.test.tsx`:

Change:
```tsx
expect(screen.getByText(/Book: how-to-talk/)).toBeInTheDocument();
```
to:
```tsx
expect(screen.getByText(/पुस्तक सापडले नाही/)).toBeInTheDocument();
```

And change:
```tsx
expect(screen.getByText(/Essay: how-to-talk \/ 01-feelings/)).toBeInTheDocument();
```
to:
```tsx
// Essay page renders nothing meaningful yet (Task 8 will fix). Just check that no error throws.
expect(document.body.textContent).toBeTruthy();
```

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "pages: Bookshelf and BookIndex with real data layer"
```

---

## Task 8: Markdown rendering with QuickRefCard detection

**Files:**
- Create: `src/components/QuickRefCard.tsx`, `src/components/EssayBody.tsx`, `src/components/EssayBody.test.tsx`
- Modify: `src/pages/Essay.tsx`, `src/styles.css`

The `QuickRefCard` block is detected by splitting the markdown body at the literal heading `## Quick reference` (case-insensitive). The portion before is rendered normally; the portion after is rendered inside a styled card.

- [ ] **Step 1: Write failing test `src/components/EssayBody.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EssayBody } from "./EssayBody";

describe("EssayBody", () => {
  it("renders plain markdown body", () => {
    render(<EssayBody body={"# Hello\n\nworld"} />);
    expect(screen.getByRole("heading", { name: "Hello" })).toBeInTheDocument();
  });

  it("splits at ## Quick reference and wraps the rest in a card", () => {
    const body = `Intro paragraph.

## Quick reference

- do this
- not that
`;
    render(<EssayBody body={body} />);
    expect(screen.getByText(/Intro paragraph/)).toBeInTheDocument();
    const card = screen.getByTestId("quick-ref-card");
    expect(card.textContent).toContain("do this");
    expect(card.textContent).toContain("not that");
  });

  it("is case-insensitive on the marker heading", () => {
    const body = `Top.

## QUICK REFERENCE

after
`;
    render(<EssayBody body={body} />);
    expect(screen.getByTestId("quick-ref-card").textContent).toContain("after");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- EssayBody`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/components/QuickRefCard.tsx`**

```tsx
import React from "react";

export const QuickRefCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <aside className="quick-ref-card" data-testid="quick-ref-card">
      <h3 className="quick-ref-card-title">Quick reference</h3>
      <div className="quick-ref-card-body">{children}</div>
    </aside>
  );
};
```

- [ ] **Step 4: Write `src/components/EssayBody.tsx`**

```tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { QuickRefCard } from "./QuickRefCard";

const QUICK_REF_RE = /^##\s+Quick\s+reference\s*$/im;

function splitBody(body: string): { main: string; quickRef: string | null } {
  const match = QUICK_REF_RE.exec(body);
  if (!match) return { main: body, quickRef: null };
  const idx = match.index;
  const main = body.slice(0, idx).trimEnd();
  const after = body.slice(idx);
  // Drop the marker heading itself; keep what follows.
  const quickRef = after.replace(QUICK_REF_RE, "").trimStart();
  return { main, quickRef };
}

export const EssayBody: React.FC<{ body: string }> = ({ body }) => {
  const { main, quickRef } = splitBody(body);
  return (
    <>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{main}</ReactMarkdown>
      {quickRef && (
        <QuickRefCard>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{quickRef}</ReactMarkdown>
        </QuickRefCard>
      )}
    </>
  );
};
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- EssayBody`
Expected: PASS — 3 tests.

- [ ] **Step 6: Style QuickRefCard in `styles.css`**

Append:

```css
.essay h2, .essay h3 { margin-top: 1.6em; }
.essay p { margin: 1em 0; }
.essay ol, .essay ul { padding-left: 1.4em; }
.essay strong { color: var(--accent); }
.quick-ref-card {
  margin: 2rem 0;
  padding: 1rem 1.25rem;
  border: 1px solid var(--accent);
  border-radius: 8px;
  background: var(--card-bg);
}
.quick-ref-card-title {
  margin: 0 0 0.5rem 0;
  color: var(--accent);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.quick-ref-card-body p:first-child { margin-top: 0; }
.quick-ref-card-body p:last-child { margin-bottom: 0; }
```

- [ ] **Step 7: Update `src/pages/Essay.tsx` to render the body**

```tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { findBook, findEssay, loadBooks } from "../books";
import { EssayBody } from "../components/EssayBody";

export const Essay: React.FC = () => {
  const { bookSlug, essaySlug } = useParams<{ bookSlug: string; essaySlug: string }>();
  const book = findBook(loadBooks(), bookSlug ?? "");
  const essay = book ? findEssay(book, essaySlug ?? "") : undefined;

  if (!book || !essay) {
    return <p>निबंध सापडला नाही. <Link to="/">मुख्य पानावर परत</Link></p>;
  }

  return (
    <article className="essay">
      <header className="essay-header">
        <Link to={`/${book.slug}`} className="essay-back">← {book.title}</Link>
        <h1>{essay.title}</h1>
        <p className="essay-meta">{essay.read_time} मिनिटे</p>
      </header>
      <EssayBody body={essay.body} />
    </article>
  );
};
```

Add to `styles.css`:

```css
.essay-header { margin-bottom: 2rem; }
.essay-header h1 { margin: 0.5rem 0; }
.essay-back {
  color: var(--fg-muted);
  text-decoration: none;
  font-size: 0.9em;
}
.essay-back:hover { color: var(--accent); }
.essay-meta { color: var(--fg-muted); margin: 0; }
```

- [ ] **Step 8: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "essay: markdown rendering with QuickRefCard detection"
```

---

## Task 9: Reading-progress hook (adapt from carousels)

**Files:**
- Create: `src/useProgress.ts`, `src/useProgress.test.ts`

This is a focused adaptation of the carousels' `useProgress.ts`. The data shape changes from `{episode, slide}` per series to `{current_essay, scroll}` per book. Completion fires when scroll crosses 0.95 (instead of "last slide"). Streak logic is preserved.

- [ ] **Step 1: Write failing test `src/useProgress.test.ts`**

This test exercises the pure helpers exported alongside the hook. The Firestore-driven hook itself is integration-tested manually (signing in and reading) — unit-testing the full hook would require mocking the Firestore SDK extensively, which is not worth the upkeep for this size of project.

```ts
import { describe, it, expect } from "vitest";
import { localDateKey, daysBetween, computeStreak, EMPTY_STREAK } from "./useProgress";

describe("localDateKey", () => {
  it("formats YYYY-MM-DD", () => {
    expect(localDateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("daysBetween", () => {
  it("returns positive int days", () => {
    expect(daysBetween("2026-01-01", "2026-01-04")).toBe(3);
  });
});

describe("computeStreak", () => {
  it("starts at 1 from empty on first read", () => {
    expect(computeStreak(EMPTY_STREAK, "2026-01-01")).toEqual({
      current: 1,
      longest: 1,
      last_read_date: "2026-01-01",
    });
  });

  it("increments on consecutive day", () => {
    expect(
      computeStreak({ current: 3, longest: 5, last_read_date: "2026-01-01" }, "2026-01-02"),
    ).toEqual({ current: 4, longest: 5, last_read_date: "2026-01-02" });
  });

  it("resets to 1 after a gap", () => {
    expect(
      computeStreak({ current: 3, longest: 5, last_read_date: "2026-01-01" }, "2026-01-05"),
    ).toEqual({ current: 1, longest: 5, last_read_date: "2026-01-05" });
  });

  it("is a no-op if same day", () => {
    const before = { current: 3, longest: 5, last_read_date: "2026-01-01" };
    expect(computeStreak(before, "2026-01-01")).toEqual(before);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- useProgress`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/useProgress.ts`**

```ts
import { useCallback, useEffect, useRef, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";

export type BookProgress = {
  current_essay: number;          // 1-indexed
  scroll: Record<string, number>; // key = essay order as string, value 0..1
};
export type ProgressMap = Record<string, BookProgress>;
export type CompletedEssaysMap = Record<string, number[]>;

export type Streak = {
  current: number;
  longest: number;
  last_read_date: string | null;
};

export const EMPTY_STREAK: Streak = { current: 0, longest: 0, last_read_date: null };
const DEBOUNCE_MS = 1500;
const COMPLETION_THRESHOLD = 0.95;

export function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  const a = new Date(fy, fm - 1, fd).getTime();
  const b = new Date(ty, tm - 1, td).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function computeStreak(prev: Streak, today: string): Streak {
  if (prev.last_read_date === today) return prev;
  const continued = !!prev.last_read_date && daysBetween(prev.last_read_date, today) === 1;
  const current = continued ? prev.current + 1 : 1;
  const longest = Math.max(prev.longest, current);
  return { current, longest, last_read_date: today };
}

export function useProgress(user: User | null) {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [completedEssays, setCompletedEssays] = useState<CompletedEssaysMap>({});
  const [streak, setStreak] = useState<Streak>(EMPTY_STREAK);
  const [loaded, setLoaded] = useState(false);

  const progressRef = useRef<ProgressMap>({});
  const completedRef = useRef<CompletedEssaysMap>({});
  const streakRef = useRef<Streak>(EMPTY_STREAK);

  const pendingProgressRef = useRef<Set<string>>(new Set()); // bookSlugs to flush
  const pendingCompletedRef = useRef<Set<string>>(new Set());
  const streakDirtyRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { completedRef.current = completedEssays; }, [completedEssays]);
  useEffect(() => { streakRef.current = streak; }, [streak]);

  // Load doc on auth change
  useEffect(() => {
    if (!user) {
      setProgress({});
      setCompletedEssays({});
      setStreak(EMPTY_STREAK);
      progressRef.current = {};
      completedRef.current = {};
      streakRef.current = EMPTY_STREAK;
      setLoaded(true);
      return;
    }
    let cancelled = false;
    setLoaded(false);
    getDoc(doc(db, "users", user.uid))
      .then((snap) => {
        if (cancelled) return;
        const data = snap.data() ?? {};
        const p = (data.progress ?? {}) as ProgressMap;
        const ce = (data.completed_essays ?? {}) as CompletedEssaysMap;
        const st = (data.streak ?? EMPTY_STREAK) as Streak;
        setProgress(p);
        setCompletedEssays(ce);
        setStreak(st);
        progressRef.current = p;
        completedRef.current = ce;
        streakRef.current = st;
      })
      .catch((e) => console.error("progress load failed", e))
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [user]);

  const flushPending = useCallback(
    async (uid: string, email: string | null, displayName: string | null) => {
      const pendingP = pendingProgressRef.current;
      const pendingC = pendingCompletedRef.current;
      const streakDirty = streakDirtyRef.current;
      pendingProgressRef.current = new Set();
      pendingCompletedRef.current = new Set();
      streakDirtyRef.current = false;

      if (pendingP.size === 0 && pendingC.size === 0 && !streakDirty) return;

      const update: Record<string, unknown> = {
        email,
        display_name: displayName,
        last_seen: serverTimestamp(),
      };
      if (pendingP.size > 0) {
        const out: Record<string, unknown> = {};
        for (const slug of pendingP) {
          const bp = progressRef.current[slug];
          if (bp) out[slug] = { ...bp, updated_at: serverTimestamp() };
        }
        update.progress = out;
      }
      if (pendingC.size > 0) {
        const out: Record<string, number[]> = {};
        for (const slug of pendingC) out[slug] = completedRef.current[slug] ?? [];
        update.completed_essays = out;
      }
      if (streakDirty) update.streak = streakRef.current;

      try {
        await setDoc(doc(db, "users", uid), update, { merge: true });
      } catch (e) {
        console.error("progress save failed", e);
      }
    },
    [],
  );

  const recordProgress = useCallback(
    (bookSlug: string, essayOrder: number, scrollFrac: number) => {
      if (!user) return;
      const clamped = Math.max(0, Math.min(1, scrollFrac));
      const key = String(essayOrder);
      const existing = progressRef.current[bookSlug] ?? {
        current_essay: essayOrder,
        scroll: {},
      };

      // Update only if value has moved meaningfully (avoid spam writes).
      const prevScroll = existing.scroll[key] ?? 0;
      const positionChanged =
        existing.current_essay !== essayOrder ||
        Math.abs(prevScroll - clamped) >= 0.02;
      if (positionChanged) {
        const next: BookProgress = {
          current_essay: essayOrder,
          scroll: { ...existing.scroll, [key]: Math.max(prevScroll, clamped) },
        };
        progressRef.current = { ...progressRef.current, [bookSlug]: next };
        setProgress(progressRef.current);
        pendingProgressRef.current.add(bookSlug);
      }

      // Completion
      if (clamped >= COMPLETION_THRESHOLD) {
        const list = completedRef.current[bookSlug] ?? [];
        if (!list.includes(essayOrder)) {
          const nextList = [...list, essayOrder].sort((a, b) => a - b);
          completedRef.current = { ...completedRef.current, [bookSlug]: nextList };
          setCompletedEssays(completedRef.current);
          pendingCompletedRef.current.add(bookSlug);

          const today = localDateKey();
          const nextStreak = computeStreak(streakRef.current, today);
          if (nextStreak !== streakRef.current) {
            streakRef.current = nextStreak;
            setStreak(nextStreak);
            streakDirtyRef.current = true;
          }
        }
      }

      const dirty =
        pendingProgressRef.current.size > 0 ||
        pendingCompletedRef.current.size > 0 ||
        streakDirtyRef.current;
      if (dirty) {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          flushPending(user.uid, user.email, user.displayName);
        }, DEBOUNCE_MS);
      }
    },
    [user, flushPending],
  );

  // Flush on tab hide / route change
  useEffect(() => {
    if (!user) return;
    const onHide = () => {
      const hasPending =
        pendingProgressRef.current.size > 0 ||
        pendingCompletedRef.current.size > 0 ||
        streakDirtyRef.current;
      if (hasPending) {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        flushPending(user.uid, user.email, user.displayName);
      }
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [user, flushPending]);

  return { progress, completedEssays, streak, loaded, recordProgress };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- useProgress`
Expected: PASS — 6 tests across 3 describe blocks.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "progress: book/essay-shaped progress hook with streak"
```

---

## Task 10: Reading UI features (progress bar, share, back-to-top, top bar) and progress wiring

**Files:**
- Create: `src/components/ReadingProgressBar.tsx`, `src/components/ShareButton.tsx`, `src/components/BackToTop.tsx`, `src/components/TopBar.tsx`, `src/components/ShareButton.test.tsx`
- Modify: `src/pages/Essay.tsx` (use TopBar + ReadingProgressBar + BackToTop, wire `recordProgress`)
- Modify: `src/App.tsx` (add FontSizeToggle to header)
- Modify: `src/styles.css`

- [ ] **Step 1: Write `src/components/ReadingProgressBar.tsx`**

```tsx
import React, { useEffect, useState } from "react";

export const ReadingProgressBar: React.FC<{
  onProgress?: (frac: number) => void;
}> = ({ onProgress }) => {
  const [frac, setFrac] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const f = total > 0 ? Math.min(1, Math.max(0, doc.scrollTop / total)) : 0;
      setFrac(f);
      onProgress?.(f);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onProgress]);
  return (
    <div className="reading-progress" aria-hidden="true">
      <div className="reading-progress-fill" style={{ width: `${frac * 100}%` }} />
    </div>
  );
};
```

- [ ] **Step 2: Write `src/components/BackToTop.tsx`**

```tsx
import React, { useEffect, useState } from "react";

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const f = total > 0 ? doc.scrollTop / total : 0;
      setVisible(f > 0.3);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="वर परत"
      title="वर परत"
    >
      ↑
    </button>
  );
};
```

- [ ] **Step 3: Write failing test `src/components/ShareButton.test.tsx`**

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ShareButton } from "./ShareButton";

describe("ShareButton", () => {
  let originalShare: unknown;
  let originalClipboard: unknown;

  beforeEach(() => {
    originalShare = (navigator as Record<string, unknown>).share;
    originalClipboard = (navigator as Record<string, unknown>).clipboard;
  });
  afterEach(() => {
    (navigator as Record<string, unknown>).share = originalShare;
    (navigator as Record<string, unknown>).clipboard = originalClipboard;
  });

  it("calls navigator.share when available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    (navigator as Record<string, unknown>).share = share;
    render(<ShareButton title="t" url="https://example.com/x" />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /share/i }));
    });
    expect(share).toHaveBeenCalledWith({ title: "t", url: "https://example.com/x" });
  });

  it("falls back to clipboard when share is unavailable", async () => {
    delete (navigator as Record<string, unknown>).share;
    const writeText = vi.fn().mockResolvedValue(undefined);
    (navigator as Record<string, unknown>).clipboard = { writeText };
    render(<ShareButton title="t" url="https://example.com/y" />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /share/i }));
    });
    expect(writeText).toHaveBeenCalledWith("https://example.com/y");
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm test -- ShareButton`
Expected: FAIL — module not found.

- [ ] **Step 5: Write `src/components/ShareButton.tsx`**

```tsx
import React, { useState } from "react";

export const ShareButton: React.FC<{ title: string; url: string }> = ({ title, url }) => {
  const [toast, setToast] = useState<string | null>(null);
  const onClick = async () => {
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title, url });
        return;
      } catch {
        // user cancelled — silent
        return;
      }
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      setToast("Link copied");
      setTimeout(() => setToast(null), 1500);
    }
  };
  return (
    <>
      <button className="share-btn" onClick={onClick} aria-label="Share">
        ↗ Share
      </button>
      {toast && <div className="share-toast">{toast}</div>}
    </>
  );
};
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- ShareButton`
Expected: PASS — 2 tests.

- [ ] **Step 7: Write `src/components/TopBar.tsx`**

```tsx
import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { FontSizeToggle } from "./FontSizeToggle";
import { ShareButton } from "./ShareButton";

export const TopBar: React.FC<{
  backTo: string;
  backLabel: string;
  shareTitle: string;
  shareUrl: string;
}> = ({ backTo, backLabel, shareTitle, shareUrl }) => {
  return (
    <div className="top-bar">
      <Link to={backTo} className="top-bar-back" aria-label={backLabel}>← {backLabel}</Link>
      <div className="top-bar-actions">
        <FontSizeToggle />
        <ThemeToggle />
        <ShareButton title={shareTitle} url={shareUrl} />
      </div>
    </div>
  );
};
```

- [ ] **Step 8: Update `src/pages/Essay.tsx` to use TopBar + progress**

Replace the file:

```tsx
import React, { useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { findBook, findEssay, loadBooks } from "../books";
import { EssayBody } from "../components/EssayBody";
import { TopBar } from "../components/TopBar";
import { ReadingProgressBar } from "../components/ReadingProgressBar";
import { BackToTop } from "../components/BackToTop";
import { useAuth } from "../useAuth";
import { useProgress } from "../useProgress";

export const Essay: React.FC = () => {
  const { bookSlug, essaySlug } = useParams<{ bookSlug: string; essaySlug: string }>();
  const book = findBook(loadBooks(), bookSlug ?? "");
  const essay = book ? findEssay(book, essaySlug ?? "") : undefined;

  const { user } = useAuth();
  const { recordProgress } = useProgress(user);

  const onProgress = useCallback(
    (frac: number) => {
      if (book && essay) recordProgress(book.slug, essay.order, frac);
    },
    [book, essay, recordProgress],
  );

  if (!book || !essay) {
    return <p>निबंध सापडला नाही. <Link to="/">मुख्य पानावर परत</Link></p>;
  }

  const prev = book.essays.find((e) => e.order === essay.order - 1);
  const next = book.essays.find((e) => e.order === essay.order + 1);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <article className="essay">
      <ReadingProgressBar onProgress={onProgress} />
      <TopBar
        backTo={`/${book.slug}`}
        backLabel={book.title}
        shareTitle={essay.title}
        shareUrl={shareUrl}
      />
      <header className="essay-header">
        <h1>{essay.title}</h1>
        <p className="essay-meta">{essay.read_time} मिनिटे</p>
      </header>
      <EssayBody body={essay.body} />
      <nav className="essay-nav">
        {prev ? (
          <Link to={`/${book.slug}/${prev.slug}`} className="essay-nav-prev">← {prev.title}</Link>
        ) : <span />}
        {next ? (
          <Link to={`/${book.slug}/${next.slug}`} className="essay-nav-next">{next.title} →</Link>
        ) : <span />}
      </nav>
      <BackToTop />
    </article>
  );
};
```

- [ ] **Step 9: Add FontSizeToggle to global header**

Edit `src/App.tsx`:

```tsx
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
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </main>
    </>
  );
};
```

- [ ] **Step 10: Add styles to `styles.css`**

Append:

```css
.reading-progress {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: transparent;
  z-index: 100;
  pointer-events: none;
}
.reading-progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 80ms linear;
}
.top-bar {
  position: sticky;
  top: 0;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  padding: 0.6rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 50;
  margin: -1rem -1rem 1rem -1rem;
}
.top-bar-back {
  color: var(--fg);
  text-decoration: none;
  font-size: 0.95em;
}
.top-bar-actions {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}
.share-btn {
  background: transparent;
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  font: inherit;
}
.share-toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--fg);
  color: var(--bg);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  z-index: 200;
}
.back-to-top {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 44px; height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--card-bg);
  color: var(--fg);
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 60;
}
.essay-nav {
  display: flex;
  justify-content: space-between;
  margin: 2rem 0 1rem 0;
  gap: 1rem;
}
.essay-nav a {
  color: var(--accent);
  text-decoration: none;
}
```

- [ ] **Step 11: Run all tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "essay-ui: progress bar, share button, top bar, back-to-top, prev/next"
```

---

## Task 11: Write essay 1 (smoke-test essay)

**Files:**
- Create: `books/how-to-talk/01-feelings.md`

This task writes the first essay end-to-end. The essay is **original prose written for this site** — not a translation, paraphrase, or close derivative of any third-party book. The principle ("acknowledging a child's feelings before fixing or instructing them") is a widely-discussed parenting concept that appears in many parenting books and articles; the essay's wording, structure, and all examples must be the implementing engineer's own original Marathi-context prose.

- [ ] **Step 1: Create `books/how-to-talk/01-feelings.md` with frontmatter**

Use the structure below. Fill the `<...>` slots with original prose during implementation. **Do not copy from any source book.** Use Marathi-context examples (Indian-style household scenarios — homework, bedtime, cousins visiting, eating, school, etc.). English loanwords stay in Roman script.

```markdown
---
title: भावना आधी, उपाय नंतर
slug: 01-feelings
order: 1
summary: मूल रडत असेल, चिडलं असेल, किंवा हट्ट करत असेल तर आधी काय करायचं — आणि काय टाळायचं.
read_time: 6
---

<one-paragraph opening scenario in original Marathi prose: a relatable Marathi-household moment — e.g. a 6-year-old refusing to do homework, or a 3-year-old refusing to eat — written in the voice of a parent observing the situation.>

**मुलाच्या भावना आधी मान्य करा. उपाय, सल्ले, lectures नंतर.**

<one-paragraph original explanation of why this matters: kids don't hear advice when they feel unheard; emotions need to land somewhere before logic can be used.>

## ही चार techniques वापरा

1. **लक्ष द्या, ऐका** — <original example dialogue in Marathi+Roman-English showing a parent putting the phone down and listening fully>
2. **भावनेला नाव द्या** — <original example: parent saying "तुला frustration येतंय का, की कंटाळा?" instead of dismissing>
3. **एका शब्दात acknowledge करा** — <original example: "हम्म." "अच्छा." "ओह." — and why these short responses help>
4. **कल्पनेत हवं ते देऊन टाका** — <original example: child wants ice cream before dinner; parent says "तुला आत्ताच ice cream खावंसं वाटतंय ना? चल, आपण कल्पना करूया — fridge full of ice cream असता तर कोणत्या flavour ने सुरुवात केली असती?">

## हे टाळा

- **लगेच logic लावणं** — "रडू नकोस, इतकी मोठी गोष्ट नाहीये." <one-line explanation>
- **तुलना करणं** — "बघ, तुझ्या चुलत भावाला हे जमतं." <one-line explanation>
- **भावना नाकारणं** — "तुला राग नाही येत. खोटं बोलू नकोस." <one-line explanation>

## Quick reference

**बोला:**
- "तुला कसं वाटतंय?"
- "हम्म, अच्छा."
- "तुला [emotion] येतंय असं वाटतंय."

**टाळा:**
- "रडू नकोस."
- "तुझ्या वयात मी…"
- "एवढी छोटी गोष्ट आहे."
```

The author of the implementing change is responsible for filling in the `<...>` slots with original prose. Any time the LLM generating this prose would be tempted to draw close-to-source-book wording, it should rewrite from a fresh, original Marathi-parent voice.

- [ ] **Step 2: Run tests + visual check**

Run: `npm test`
Expected: all tests still pass (Markdown content does not break the loader).

Run: `npm run dev`
Visit:
- `http://localhost:5173/` — bookshelf shows "मुलांशी कसं बोलावं" with "9 निबंध" or whichever count corresponds to the essays present.
- `http://localhost:5173/how-to-talk` — book index lists essay 1.
- `http://localhost:5173/how-to-talk/01-feelings` — essay renders with TopBar, body, Quick reference card at the bottom, prev/next nav (no prev, "next" if there were a 2nd essay; otherwise no next), back-to-top button visible after scrolling.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "content: essay 1 — भावना आधी, उपाय नंतर (smoke-test essay)"
```

---

## Task 12: Build-time scripts (OG cards, static stubs, sitemap)

**Files:**
- Create: `scripts/_essays.ts`, `scripts/generate-og-cards.ts`, `scripts/generate-static-html.ts`, `scripts/generate-sitemap.ts`

These run after `vite build`. They share a small helper that reads the essay frontmatter and the dist'd `index.html`.

- [ ] **Step 1: Write `scripts/_essays.ts`**

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type EssayMeta = {
  bookSlug: string;
  essaySlug: string;
  title: string;
  order: number;
  summary: string;
  read_time: number;
};

export function readBookSlugs(booksDir: string): string[] {
  return fs.readdirSync(booksDir).filter((d) =>
    fs.statSync(path.join(booksDir, d)).isDirectory(),
  );
}

export function readEssaysFor(booksDir: string, bookSlug: string): EssayMeta[] {
  const dir = path.join(booksDir, bookSlug);
  const out: EssayMeta[] = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const essaySlug = file.replace(/\.md$/, "");
    const summary = data.summary
      ? String(data.summary)
      : content.split(/\n\s*\n/)[0]?.replace(/[#>*_`]/g, "").trim().slice(0, 160) ?? "";
    out.push({
      bookSlug,
      essaySlug,
      title: String(data.title ?? essaySlug),
      order: Number(data.order ?? 0),
      summary,
      read_time: Number(data.read_time ?? 0),
    });
  }
  out.sort((a, b) => a.order - b.order);
  return out;
}

export function readAllEssays(booksDir: string): EssayMeta[] {
  return readBookSlugs(booksDir).flatMap((b) => readEssaysFor(booksDir, b));
}

export const SITE_BASE = process.env.VITE_BASE ?? "/books/";
export const SITE_ORIGIN = "https://instamarathi.github.io";
```

- [ ] **Step 2: Write `scripts/generate-og-cards.ts`**

```ts
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readAllEssays } from "./_essays";

const ROOT = path.resolve(".");
const BOOKS_DIR = path.join(ROOT, "books");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(DIST, "og");

const FONT_TIRO = "https://fonts.gstatic.com/s/tirodevanagarimarathi/v8/.../font.ttf"; // see step 3
const FONT_INTER = "https://fonts.gstatic.com/s/inter/v18/.../font.ttf";

async function fetchFont(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const essays = readAllEssays(BOOKS_DIR);
  const tiro = await fetchFont(FONT_TIRO);
  const inter = await fetchFont(FONT_INTER);

  fs.mkdirSync(OUT, { recursive: true });

  for (const e of essays) {
    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px",
            background: "#FAF7F2",
            color: "#1F1B16",
            fontFamily: "Tiro Devanagari Marathi",
          },
          children: [
            {
              type: "div",
              props: {
                style: { fontSize: "32px", color: "#C76C2D", fontFamily: "Inter" },
                children: `निबंध ${e.order}`,
              },
            },
            {
              type: "div",
              props: {
                style: { fontSize: "72px", lineHeight: 1.2 },
                children: e.title,
              },
            },
            {
              type: "div",
              props: {
                style: { fontSize: "28px", color: "#6B6359", fontFamily: "Inter" },
                children: "instamarathi books",
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Tiro Devanagari Marathi", data: tiro, weight: 400, style: "normal" },
          { name: "Inter", data: inter, weight: 400, style: "normal" },
        ],
      },
    );
    const png = new Resvg(svg, { background: "#FAF7F2" }).render().asPng();
    const outDir = path.join(OUT, e.bookSlug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `${e.essaySlug}.png`), png);
    console.log(`wrote og/${e.bookSlug}/${e.essaySlug}.png`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 3: Resolve the actual font URLs**

The two `https://fonts.gstatic.com/...` URLs above are placeholders. The implementing engineer must:
1. Open `https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Tiro+Devanagari+Marathi&display=swap` in a browser.
2. From the response, extract the two `.ttf` (or `.woff2` — convert if needed) URLs for the Marathi/Latin subsets.
3. Either hard-code the `.ttf` URLs into `generate-og-cards.ts`, or — simpler — download them once into `scripts/fonts/` and read them via `fs.readFileSync`. The latter is preferred for reproducibility.

Update the script accordingly. If using local font files, replace `fetchFont` with `fs.readFileSync`.

Note: the Anthropic SDK and the package for resvg is `@resvg/resvg-js` — make sure to add it to `package.json` if it isn't there. (It is in Task 1's `package.json` as `resvg-js`. The correct npm name is `@resvg/resvg-js` — fix the package.json import to `"@resvg/resvg-js": "^2.6.2"` and remove `"resvg-js"`.)

- [ ] **Step 4: Fix `package.json` resvg name**

Edit `package.json` → `devDependencies`:
- Remove: `"resvg-js": "^2.6.2"`
- Add: `"@resvg/resvg-js": "^2.6.2"`
- Run: `npm install`

- [ ] **Step 5: Write `scripts/generate-static-html.ts`**

```ts
import fs from "node:fs";
import path from "node:path";
import { readAllEssays, readBookSlugs, SITE_BASE, SITE_ORIGIN } from "./_essays";

const ROOT = path.resolve(".");
const BOOKS_DIR = path.join(ROOT, "books");
const DIST = path.join(ROOT, "dist");

const TEMPLATE = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

function injectMeta(template: string, meta: Record<string, string>): string {
  const tags = Object.entries(meta)
    .map(([k, v]) => {
      const safe = String(v).replace(/"/g, "&quot;");
      if (k === "title") return `<title>${safe}</title>`;
      if (k.startsWith("og:") || k.startsWith("twitter:")) {
        return `<meta property="${k}" content="${safe}" />`;
      }
      return `<meta name="${k}" content="${safe}" />`;
    })
    .join("\n    ");
  // Inject just before </head>
  return template.replace("</head>", `    ${tags}\n  </head>`);
}

function essayUrl(bookSlug: string, essaySlug: string): string {
  return `${SITE_ORIGIN}${SITE_BASE}${bookSlug}/${essaySlug}/`;
}

function ogImage(bookSlug: string, essaySlug: string): string {
  return `${SITE_ORIGIN}${SITE_BASE}og/${bookSlug}/${essaySlug}.png`;
}

function writeStub(filePath: string, html: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
}

function main() {
  const essays = readAllEssays(BOOKS_DIR);
  for (const e of essays) {
    const html = injectMeta(TEMPLATE, {
      title: `${e.title} — instamarathi books`,
      description: e.summary,
      "og:title": e.title,
      "og:description": e.summary,
      "og:type": "article",
      "og:url": essayUrl(e.bookSlug, e.essaySlug),
      "og:image": ogImage(e.bookSlug, e.essaySlug),
      "og:locale": "mr_IN",
      "twitter:card": "summary_large_image",
      "twitter:title": e.title,
      "twitter:description": e.summary,
      "twitter:image": ogImage(e.bookSlug, e.essaySlug),
    });
    const outPath = path.join(DIST, e.bookSlug, e.essaySlug, "index.html");
    writeStub(outPath, html);
    console.log(`wrote ${path.relative(DIST, outPath)}`);
  }

  // Per-book index pages: minimal OG (just the book title)
  for (const bookSlug of readBookSlugs(BOOKS_DIR)) {
    const metaPath = path.join(BOOKS_DIR, bookSlug, "meta.json");
    if (!fs.existsSync(metaPath)) continue;
    const m = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as {
      title: string; subtitle?: string;
    };
    const html = injectMeta(TEMPLATE, {
      title: `${m.title} — instamarathi books`,
      description: m.subtitle ?? m.title,
      "og:title": m.title,
      "og:description": m.subtitle ?? m.title,
      "og:type": "book",
      "og:url": `${SITE_ORIGIN}${SITE_BASE}${bookSlug}/`,
      "og:locale": "mr_IN",
    });
    writeStub(path.join(DIST, bookSlug, "index.html"), html);
    console.log(`wrote ${bookSlug}/index.html`);
  }

  // 404 fallback
  const fourOhFour = path.join(DIST, "404.html");
  fs.writeFileSync(fourOhFour, TEMPLATE);
  console.log("wrote 404.html");
}

main();
```

- [ ] **Step 6: Write `scripts/generate-sitemap.ts`**

```ts
import fs from "node:fs";
import path from "node:path";
import { readAllEssays, readBookSlugs, SITE_BASE, SITE_ORIGIN } from "./_essays";

const ROOT = path.resolve(".");
const BOOKS_DIR = path.join(ROOT, "books");
const DIST = path.join(ROOT, "dist");

function url(p: string): string {
  return `${SITE_ORIGIN}${SITE_BASE}${p}`.replace(/\/+$/, "/");
}

function entry(loc: string): string {
  return `  <url><loc>${loc}</loc></url>`;
}

function main() {
  const lines: string[] = [];
  lines.push(entry(url("")));
  for (const b of readBookSlugs(BOOKS_DIR)) {
    lines.push(entry(url(`${b}/`)));
  }
  for (const e of readAllEssays(BOOKS_DIR)) {
    lines.push(entry(url(`${e.bookSlug}/${e.essaySlug}/`)));
  }
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    lines.join("\n") +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), xml);
  console.log(`wrote sitemap.xml with ${lines.length} entries`);
}

main();
```

- [ ] **Step 7: Add `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://instamarathi.github.io/books/sitemap.xml
```

- [ ] **Step 8: Add `public/favicon.svg` (placeholder)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#C76C2D"/>
  <text x="50%" y="56%" font-family="Inter,sans-serif" font-size="36" font-weight="700"
        fill="#FAF7F2" text-anchor="middle" dominant-baseline="middle">i</text>
</svg>
```

- [ ] **Step 9: Run a full production build**

Run: `npm run build`
Expected:
- `dist/` exists with `index.html`, `assets/`, and the JS bundle.
- `dist/og/how-to-talk/01-feelings.png` exists and is a valid PNG (~50–150 KB).
- `dist/how-to-talk/01-feelings/index.html` exists; opening it in a browser shows the SPA loading correctly.
- `dist/how-to-talk/index.html` exists.
- `dist/sitemap.xml` exists with at least 3 `<url>` entries.
- `dist/404.html` exists.
- `dist/robots.txt` exists.

If any step fails, fix the offending script and re-run `npm run build` until clean.

- [ ] **Step 10: Inspect a stub for OG correctness**

Run: `grep -E '(og:title|og:image|og:description)' dist/how-to-talk/01-feelings/index.html`
Expected: three lines printed, each containing the essay title, image URL, and summary text.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "build: OG cards, static HTML stubs, sitemap, robots, favicon"
```

---

## Task 13: Firestore rules and GitHub Actions deploy

**Files:**
- Create: `firestore.rules`, `.github/workflows/deploy.yml`

- [ ] **Step 1: Copy `firestore.rules` from carousels**

Run: `cp /Users/anup/claude_tmp/carousels/firestore.rules firestore.rules`

Verify the file content:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

These rules already match the data shape used by `useProgress.ts`. No change needed unless the user wants to deploy them — which is done from the Firebase console for the existing project, **not** as part of this plan.

- [ ] **Step 2: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          VITE_BASE: /books/
      - uses: actions/configure-pages@v5
        with:
          enablement: true
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Verify build runs with VITE_BASE set**

Run: `VITE_BASE=/books/ npm run build`
Expected: build completes without error. `dist/index.html` references `/books/assets/...` paths.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "ci: GitHub Pages workflow + firestore rules copy"
```

---

## Task 14: Final smoke test

**Files:** none new.

- [ ] **Step 1: Run all tests one more time**

Run: `npm test`
Expected: all tests pass with no warnings about act() or other React issues.

- [ ] **Step 2: Run a clean production build**

Run: `rm -rf dist && VITE_BASE=/books/ npm run build`
Expected: clean build, all four post-build scripts run successfully.

- [ ] **Step 3: Local preview of the built site**

Run: `npm run preview`
Visit `http://localhost:4173/books/` (the path Vite preview uses with the `/books/` base).

Verify:
- Bookshelf loads with the one book.
- Click into the book — index loads with essay 1 listed.
- Click into the essay — body renders with TopBar, ReadingProgressBar, BackToTop after scrolling, Quick reference card at the bottom.
- Sign in with Google: AuthWidget switches to a user chip.
- Scroll to the bottom of the essay; refresh the page; reopen the essay — scroll should restore-via-progress logic exists in the data, but actual scroll-restoration UX is out of scope. Just confirm no console errors.
- Stop preview.

- [ ] **Step 4: Final commit (only if any tweaks were needed during smoke test)**

```bash
git add -A
git commit -m "polish: final smoke test fixes" || echo "(no changes)"
```

---

## Out of scope for this plan (to be done outside)

- Creating the GitHub repo `instamarathi/books`, setting GitHub Pages source to "GitHub Actions", and pushing the first commit. This is a one-time manual step the user does.
- Verifying the OG card unfurl in WhatsApp once the site is live (visual check on the user's phone).
- Writing essays 2 through 9 — pure content work, each is a single new `.md` file dropped into `books/how-to-talk/`. Essay quality bar: original prose, Marathi+Roman-English, 700–1000 words, follows the structure shown in essay 1 (opening scenario → bolded principle → numbered techniques → pitfalls → Quick reference).

---

## Self-review notes

Spec coverage check (see `docs/superpowers/specs/2026-04-26-instamarathi-books-design.md`):

- Goal section: ✓ covered by Tasks 1–14 collectively.
- Audience and writing style: ✓ Task 11 enforces the Marathi+Roman-English voice and original-prose rule.
- Book 1 plan (9 essays): partial — essay 1 is in this plan as smoke test (Task 11); essays 2–9 are explicitly out of scope here per the "Scope of this plan" header.
- Tech stack: ✓ Task 1 (Vite/React/TS), Task 2 (Firebase), Task 5 (router).
- Repo layout: ✓ matches `File Structure` section above.
- Essay Markdown format: ✓ Task 6 parser, Task 11 first essay.
- Firestore data model: ✓ Task 9 (`useProgress.ts`).
- Pages and routing: ✓ Tasks 5, 7, 10.
- Reading experience (fonts, theme, font size, progress bar, share, back-to-top): ✓ Tasks 1 (fonts), 3, 4, 10.
- Sharing and metadata (per-essay OG cards + stubs, sitemap, robots, favicon): ✓ Task 12.
- Build and deploy: ✓ Tasks 1 (scripts), 13 (CI).
- Author workflow: ✓ implicit — drop a `.md`, edit `meta.json`, push.
- Open questions in spec (final book title, source-book attribution, cover treatment): handled in Task 11 (`meta.json` placeholder credit) and Task 6 (book title `मुलांशी कसं बोलावं` placed in `meta.json`). Both are easy to edit later.

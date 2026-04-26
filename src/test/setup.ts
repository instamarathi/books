import "@testing-library/jest-dom";

// Node 25 ships a stub localStorage that lacks browser methods.
// Replace it with a simple in-memory implementation so tests work in jsdom.
if (typeof localStorage === "undefined" || typeof localStorage.clear !== "function") {
  const store: Record<string, string> = {};
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      get length() { return Object.keys(store).length; },
      key(i: number) { return Object.keys(store)[i] ?? null; },
      getItem(k: string) { return k in store ? store[k] : null; },
      setItem(k: string, v: string) { store[k] = String(v); },
      removeItem(k: string) { delete store[k]; },
      clear() { Object.keys(store).forEach(k => delete store[k]); },
    },
  });
}

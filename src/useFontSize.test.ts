import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFontSize } from "./useFontSize";

describe("useFontSize", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.removeProperty("--body-size");
  });

  it("defaults to medium (20px)", () => {
    const { result } = renderHook(() => useFontSize());
    expect(result.current.size).toBe("medium");
    expect(document.documentElement.style.getPropertyValue("--body-size")).toBe("20px");
  });

  it("loads stored size", () => {
    localStorage.setItem("font-size", "large");
    const { result } = renderHook(() => useFontSize());
    expect(result.current.size).toBe("large");
    expect(document.documentElement.style.getPropertyValue("--body-size")).toBe("22px");
  });

  it("setSize updates state, localStorage, and the CSS variable", () => {
    const { result } = renderHook(() => useFontSize());
    act(() => result.current.setSize("small"));
    expect(result.current.size).toBe("small");
    expect(localStorage.getItem("font-size")).toBe("small");
    expect(document.documentElement.style.getPropertyValue("--body-size")).toBe("17px");
  });
});

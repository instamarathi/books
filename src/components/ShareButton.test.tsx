import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ShareButton } from "./ShareButton";

describe("ShareButton", () => {
  let originalShare: unknown;
  let originalClipboard: unknown;

  beforeEach(() => {
    originalShare = (navigator as unknown as Record<string, unknown>).share;
    originalClipboard = (navigator as unknown as Record<string, unknown>).clipboard;
  });
  afterEach(() => {
    (navigator as unknown as Record<string, unknown>).share = originalShare;
    (navigator as unknown as Record<string, unknown>).clipboard = originalClipboard;
  });

  it("calls navigator.share when available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    (navigator as unknown as Record<string, unknown>).share = share;
    render(<ShareButton title="t" url="https://example.com/x" />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /share/i }));
    });
    expect(share).toHaveBeenCalledWith({ title: "t", url: "https://example.com/x" });
  });

  it("falls back to clipboard when share is unavailable", async () => {
    delete (navigator as unknown as Record<string, unknown>).share;
    const writeText = vi.fn().mockResolvedValue(undefined);
    (navigator as unknown as Record<string, unknown>).clipboard = { writeText };
    render(<ShareButton title="t" url="https://example.com/y" />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /share/i }));
    });
    expect(writeText).toHaveBeenCalledWith("https://example.com/y");
  });
});

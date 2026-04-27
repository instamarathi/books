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

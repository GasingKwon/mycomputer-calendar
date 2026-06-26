import { describe, expect, it } from "vitest";
import { daysBetween, formatDateKey, isValidDateKey, isValidTime, parseDateKey } from "../../shared/date";

describe("date utilities", () => {
  it("formats and parses YYYY-MM-DD dates", () => {
    expect(formatDateKey(parseDateKey("2026-06-25"))).toBe("2026-06-25");
  });

  it("validates date and time formats", () => {
    expect(isValidDateKey("2026-06-25")).toBe(true);
    expect(isValidDateKey("2026-02-31")).toBe(false);
    expect(isValidTime("14:00")).toBe(true);
    expect(isValidTime("24:00")).toBe(false);
  });

  it("calculates day differences", () => {
    expect(daysBetween("2026-06-01", "2026-06-08")).toBe(7);
    expect(daysBetween("2026-06-08", "2026-06-01")).toBe(-7);
  });
});

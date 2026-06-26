import { describe, expect, it } from "vitest";
import { createMonthGrid, getDayPreview, getTasksForDate } from "../../shared/calendar";
import type { Task } from "../../shared/types";

function task(id: string, title: string, date: string): Task {
  return {
    id,
    title,
    date,
    time: null,
    categoryId: null,
    priority: "normal",
    dueDate: null,
    repeatEveryDays: null,
    notificationEnabled: true,
    completed: false,
    memo: "",
    createdAt: "2026-06-01T00:00:00+09:00",
    updatedAt: "2026-06-01T00:00:00+09:00"
  };
}

describe("calendar", () => {
  it("creates a 42-day month grid", () => {
    const grid = createMonthGrid(new Date(2026, 5, 1));
    expect(grid).toHaveLength(42);
    expect(grid.some((day) => day.date === "2026-06-01")).toBe(true);
  });

  it("filters tasks for a selected date", () => {
    const tasks = [task("1", "A", "2026-06-10"), task("2", "B", "2026-06-11")];
    expect(getTasksForDate(tasks, "2026-06-10").map((item) => item.title)).toEqual(["A"]);
  });

  it("calculates visible previews and hidden count", () => {
    const tasks = [
      task("1", "A", "2026-06-10"),
      task("2", "B", "2026-06-10"),
      task("3", "C", "2026-06-10"),
      task("4", "D", "2026-06-10"),
      task("5", "E", "2026-06-10")
    ];
    const preview = getDayPreview(tasks, "2026-06-10", 3);
    expect(preview.visible).toHaveLength(3);
    expect(preview.hiddenCount).toBe(2);
  });
});

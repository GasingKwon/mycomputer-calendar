import { describe, expect, it } from "vitest";
import { occursOnDate } from "../../shared/recurrence";
import type { Task } from "../../shared/types";

const baseTask: Task = {
  id: "task-1",
  title: "Weekly review",
  date: "2026-06-01",
  time: null,
  categoryId: null,
  priority: "normal",
  dueDate: null,
  repeatEveryDays: 7,
  notificationEnabled: true,
  completed: false,
  memo: "",
  createdAt: "2026-06-01T00:00:00+09:00",
  updatedAt: "2026-06-01T00:00:00+09:00"
};

describe("recurrence", () => {
  it("shows repeating tasks on the base date and interval dates", () => {
    expect(occursOnDate(baseTask, "2026-06-01")).toBe(true);
    expect(occursOnDate(baseTask, "2026-06-08")).toBe(true);
    expect(occursOnDate(baseTask, "2026-06-15")).toBe(true);
  });

  it("does not show repeating tasks before the base date or off interval", () => {
    expect(occursOnDate(baseTask, "2026-05-31")).toBe(false);
    expect(occursOnDate(baseTask, "2026-06-02")).toBe(false);
  });

  it("shows non-repeating tasks only on their base date", () => {
    const task = { ...baseTask, repeatEveryDays: null };
    expect(occursOnDate(task, "2026-06-01")).toBe(true);
    expect(occursOnDate(task, "2026-06-08")).toBe(false);
  });

  it("shows tasks on due date once", () => {
    const task = { ...baseTask, repeatEveryDays: null, dueDate: "2026-06-30" };
    expect(occursOnDate(task, "2026-06-30")).toBe(true);
  });
});

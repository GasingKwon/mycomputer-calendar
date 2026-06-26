import { daysBetween } from "./date";
import type { Task } from "./types";

export function occursOnDate(task: Task, dateKey: string): boolean {
  if (task.date === dateKey || task.dueDate === dateKey) {
    return true;
  }

  if (!task.repeatEveryDays) {
    return false;
  }

  const diff = daysBetween(task.date, dateKey);
  return diff >= 0 && diff % task.repeatEveryDays === 0;
}

import { formatDateKey, getTodayKey } from "./date";
import { occursOnDate } from "./recurrence";
import type { CalendarDay, DayPreview, Task } from "./types";

export function createMonthGrid(monthDate: Date): CalendarDay[] {
  const today = getTodayKey();
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const dateKey = formatDateKey(date);

    return {
      date: dateKey,
      dayNumber: date.getDate(),
      inCurrentMonth: date.getMonth() === monthDate.getMonth(),
      isToday: dateKey === today
    };
  });
}

export function getTasksForDate(tasks: Task[], dateKey: string): Task[] {
  const seen = new Set<string>();

  return tasks
    .filter((task) => occursOnDate(task, dateKey))
    .filter((task) => {
      if (seen.has(task.id)) {
        return false;
      }
      seen.add(task.id);
      return true;
    })
    .sort(compareTasks);
}

export function getDayPreview(tasks: Task[], dateKey: string, limit = 3): DayPreview {
  const dayTasks = getTasksForDate(tasks, dateKey);

  return {
    visible: dayTasks.slice(0, limit),
    hiddenCount: Math.max(0, dayTasks.length - limit)
  };
}

export function compareTasks(a: Task, b: Task): number {
  if (a.completed !== b.completed) {
    return a.completed ? 1 : -1;
  }

  if (a.time && b.time && a.time !== b.time) {
    return a.time.localeCompare(b.time);
  }

  if (a.time && !b.time) {
    return -1;
  }

  if (!a.time && b.time) {
    return 1;
  }

  const priorityWeight = { high: 0, normal: 1, low: 2 };
  return priorityWeight[a.priority] - priorityWeight[b.priority] || a.title.localeCompare(b.title);
}

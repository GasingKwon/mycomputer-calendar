import { CATEGORY_COLORS, DEFAULT_APP_DATA, PRIORITIES } from "./constants";
import { isValidDateKey, isValidTime } from "./date";
import type { AppData, AppSettings, Category, Task, WaterRecord } from "./types";

export function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") {
    return false;
  }

  const task = value as Task;

  const maybeCategoryId = (task as Partial<Task>).categoryId;

  return (
    typeof task.id === "string" &&
    task.id.length > 0 &&
    typeof task.title === "string" &&
    task.title.trim().length > 0 &&
    isValidDateKey(task.date) &&
    (maybeCategoryId === null || typeof maybeCategoryId === "string" || maybeCategoryId === undefined) &&
    (task.time === null || isValidTime(task.time)) &&
    PRIORITIES.includes(task.priority) &&
    (task.dueDate === null || isValidDateKey(task.dueDate)) &&
    (task.repeatEveryDays === null ||
      (Number.isInteger(task.repeatEveryDays) && task.repeatEveryDays >= 1)) &&
    typeof task.notificationEnabled === "boolean" &&
    typeof task.completed === "boolean" &&
    typeof task.memo === "string" &&
    typeof task.createdAt === "string" &&
    typeof task.updatedAt === "string"
  );
}

export function normalizeTask(value: unknown): Task | null {
  if (!isTask(value)) {
    return null;
  }

  const task = value as Task;

  return {
    ...task,
    categoryId: (task as Partial<Task>).categoryId ?? null
  };
}

export function normalizeCategories(value: unknown): Category[] {
  const source = Array.isArray(value) ? value : DEFAULT_APP_DATA.categories;
  const seen = new Set<string>();
  const categories = source
    .filter((item): item is Partial<Category> => Boolean(item) && typeof item === "object")
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id : `category-${index + 1}`,
      name: typeof item.name === "string" && item.name.trim() ? item.name.trim() : `카테고리 ${index + 1}`,
      color:
        typeof item.color === "string" && /^#[0-9a-fA-F]{6}$/.test(item.color)
          ? item.color
          : CATEGORY_COLORS[index % CATEGORY_COLORS.length]
    }))
    .filter((category) => {
      if (seen.has(category.id)) {
        return false;
      }
      seen.add(category.id);
      return true;
    });

  return categories.length ? categories : DEFAULT_APP_DATA.categories;
}

export function normalizeWaterRecords(value: unknown): WaterRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();

  return value
    .filter((item): item is Partial<WaterRecord> => Boolean(item) && typeof item === "object")
    .filter((item) => isValidDateKey(item.date) && typeof item.amountMl === "number")
    .map((item) => ({
      date: item.date as string,
      amountMl: Math.max(0, Math.floor(item.amountMl ?? 0))
    }))
    .filter((record) => {
      if (seen.has(record.date)) {
        return false;
      }
      seen.add(record.date);
      return true;
    });
}

export function normalizeSettings(value: unknown): AppSettings {
  const settings = value && typeof value === "object" ? (value as Partial<AppSettings>) : {};
  const fallback = DEFAULT_APP_DATA.settings;

  return {
    alwaysOnTop:
      typeof settings.alwaysOnTop === "boolean" ? settings.alwaysOnTop : fallback.alwaysOnTop,
    opacity:
      typeof settings.opacity === "number" && settings.opacity > 0 && settings.opacity <= 1
        ? settings.opacity
        : fallback.opacity,
    startAtLogin:
      typeof settings.startAtLogin === "boolean" ? settings.startAtLogin : fallback.startAtLogin,
    windowBounds: {
      x:
        typeof settings.windowBounds?.x === "number"
          ? settings.windowBounds.x
          : fallback.windowBounds.x,
      y:
        typeof settings.windowBounds?.y === "number"
          ? settings.windowBounds.y
          : fallback.windowBounds.y,
      width:
        typeof settings.windowBounds?.width === "number"
          ? settings.windowBounds.width
          : fallback.windowBounds.width,
      height:
        typeof settings.windowBounds?.height === "number"
          ? settings.windowBounds.height
          : fallback.windowBounds.height
    }
  };
}

export function normalizeAppData(value: unknown): AppData {
  if (!value || typeof value !== "object") {
    return DEFAULT_APP_DATA;
  }

  const data = value as Partial<AppData>;

  return {
    schemaVersion: 1,
    tasks: Array.isArray(data.tasks)
      ? data.tasks.map(normalizeTask).filter((task): task is Task => task !== null)
      : [],
    categories: normalizeCategories(data.categories),
    waterRecords: normalizeWaterRecords(data.waterRecords),
    settings: normalizeSettings(data.settings)
  };
}

export function validateTaskInput(task: Pick<Task, "title" | "date" | "time" | "priority" | "dueDate" | "repeatEveryDays">) {
  const errors: string[] = [];

  if (!task.title.trim()) {
    errors.push("Title is required.");
  }

  if (!isValidDateKey(task.date)) {
    errors.push("Date must be YYYY-MM-DD.");
  }

  if (task.time !== null && !isValidTime(task.time)) {
    errors.push("Time must be HH:mm.");
  }

  if (!PRIORITIES.includes(task.priority)) {
    errors.push("Priority is invalid.");
  }

  if (task.dueDate !== null && !isValidDateKey(task.dueDate)) {
    errors.push("Due date must be YYYY-MM-DD.");
  }

  if (
    task.repeatEveryDays !== null &&
    (!Number.isInteger(task.repeatEveryDays) || task.repeatEveryDays < 1)
  ) {
    errors.push("Repeat interval must be a positive integer.");
  }

  return errors;
}

export type Priority = "low" | "normal" | "high";

export interface Task {
  id: string;
  title: string;
  date: string;
  time: string | null;
  categoryId: string | null;
  priority: Priority;
  dueDate: string | null;
  repeatEveryDays: number | null;
  notificationEnabled: boolean;
  completed: boolean;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface WaterRecord {
  date: string;
  amountMl: number;
}

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AppSettings {
  alwaysOnTop: boolean;
  opacity: number;
  startAtLogin: boolean;
  windowBounds: WindowBounds;
}

export interface AppData {
  schemaVersion: 1;
  tasks: Task[];
  categories: Category[];
  waterRecords: WaterRecord[];
  settings: AppSettings;
}

export type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;

export interface CalendarDay {
  date: string;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
}

export interface DayPreview {
  visible: Task[];
  hiddenCount: number;
}

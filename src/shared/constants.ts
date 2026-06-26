import type { AppData, Priority } from "./types";

export const APP_NAME = "할 일을 기억해라";
export const DATA_SCHEMA_VERSION = 1;
export const DAILY_WATER_GOAL_ML = 2000;
export const WATER_INCREMENT_ML = 100;
export const PRIORITIES: Priority[] = ["low", "normal", "high"];
export const CATEGORY_COLORS = ["#1a73e8", "#188038", "#d93025", "#f9ab00", "#9334e6", "#00acc1"];

export const DEFAULT_APP_DATA: AppData = {
  schemaVersion: DATA_SCHEMA_VERSION,
  tasks: [],
  categories: [
    {
      id: "study",
      name: "공부",
      color: "#1a73e8"
    },
    {
      id: "home",
      name: "집안일",
      color: "#188038"
    }
  ],
  waterRecords: [],
  settings: {
    alwaysOnTop: false,
    opacity: 1,
    startAtLogin: false,
    windowBounds: {
      x: 100,
      y: 100,
      width: 1100,
      height: 720
    }
  }
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "낮음",
  normal: "보통",
  high: "높음"
};

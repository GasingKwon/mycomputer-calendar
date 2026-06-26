import { app } from "electron";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { DEFAULT_APP_DATA } from "../shared/constants";
import { normalizeAppData } from "../shared/validation";
import type { AppData, AppSettings, Task } from "../shared/types";

let cachedData: AppData | null = null;

export function getDataFilePath() {
  return join(app.getPath("userData"), "data.json");
}

export async function loadAppData(): Promise<AppData> {
  const dataPath = getDataFilePath();

  if (!existsSync(dataPath)) {
    cachedData = structuredClone(DEFAULT_APP_DATA);
    await saveAppData(cachedData);
    return cachedData;
  }

  try {
    const raw = await readFile(dataPath, "utf8");
    cachedData = normalizeAppData(JSON.parse(raw));
    return cachedData;
  } catch {
    cachedData = structuredClone(DEFAULT_APP_DATA);
    await backupBrokenData(dataPath);
    await saveAppData(cachedData);
    return cachedData;
  }
}

export async function saveAppData(data: AppData): Promise<AppData> {
  const normalized = normalizeAppData(data);
  const dataPath = getDataFilePath();
  await mkdir(dirname(dataPath), { recursive: true });
  await writeFile(dataPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  cachedData = normalized;
  return normalized;
}

export async function getAppData(): Promise<AppData> {
  if (!cachedData) {
    return loadAppData();
  }

  return cachedData;
}

export async function updateSettings(patch: Partial<AppSettings>): Promise<AppData> {
  const data = await getAppData();
  return saveAppData({
    ...data,
    settings: {
      ...data.settings,
      ...patch,
      windowBounds: patch.windowBounds ?? data.settings.windowBounds
    }
  });
}

export async function upsertTask(task: Task): Promise<AppData> {
  const data = await getAppData();
  const index = data.tasks.findIndex((item) => item.id === task.id);
  const tasks = [...data.tasks];

  if (index >= 0) {
    tasks[index] = task;
  } else {
    tasks.push(task);
  }

  return saveAppData({ ...data, tasks });
}

export async function deleteTask(taskId: string): Promise<AppData> {
  const data = await getAppData();
  return saveAppData({
    ...data,
    tasks: data.tasks.filter((task) => task.id !== taskId)
  });
}

async function backupBrokenData(dataPath: string) {
  if (!existsSync(dataPath)) {
    return;
  }

  const backupPath = `${dataPath}.broken-${Date.now()}`;

  try {
    await rename(dataPath, backupPath);
  } catch {
    // If backup fails, continue with a fresh file rather than blocking launch.
  }
}

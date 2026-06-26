import { BrowserWindow, ipcMain, app } from "electron";
import { join } from "node:path";
import { APP_NAME } from "../shared/constants";
import { deleteTask, getAppData, getDataFilePath, loadAppData, saveAppData, updateSettings, upsertTask } from "./storage";
import { setupTray } from "./tray";
import { getAppIconPath } from "./app-icon";
import type { AppData, AppSettings, Category, Task } from "../shared/types";

let mainWindow: BrowserWindow | null = null;
let isQuitting = false;
let isWidgetMode = false;

export async function createMainWindow() {
  const data = await loadAppData();
  const bounds = data.settings.windowBounds;

  mainWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    minWidth: 640,
    minHeight: 520,
    title: APP_NAME,
    icon: getAppIconPath(),
    backgroundColor: "#f8fafd",
    show: false,
    opacity: data.settings.opacity,
    alwaysOnTop: data.settings.alwaysOnTop,
    webPreferences: {
      preload: join(__dirname, "../preload/preload.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  setupTray(() => mainWindow);
  mainWindow.once("ready-to-show", () => mainWindow?.show());
  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
  mainWindow.on("resized", () => void persistWindowBounds());
  mainWindow.on("moved", () => void persistWindowBounds());

  const devUrl = process.env.ELECTRON_RENDERER_URL;

  if (devUrl) {
    await mainWindow.loadURL(devUrl);
  } else {
    await mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return mainWindow;
}

export function getMainWindow() {
  return mainWindow;
}

export function markQuitting() {
  isQuitting = true;
}

export function registerIpcHandlers() {
  ipcMain.handle("data:load", () => getAppData());
  ipcMain.handle("data:save", (_event, data: AppData) => saveAppData(data));
  ipcMain.handle("task:upsert", (_event, task: Task) => upsertTask(task));
  ipcMain.handle("task:delete", (_event, taskId: string) => deleteTask(taskId));
  ipcMain.handle("settings:update", async (_event, patch: Partial<AppSettings>) => {
    const next = await updateSettings(patch);
    applySettings(next.settings);
    return next;
  });
  ipcMain.handle("categories:save", async (_event, categories: Category[]) => {
    const data = await getAppData();
    const validIds = new Set(categories.map((category) => category.id));
    return saveAppData({
      ...data,
      categories,
      tasks: data.tasks.map((task) =>
        task.categoryId && !validIds.has(task.categoryId) ? { ...task, categoryId: null } : task
      )
    });
  });
  ipcMain.handle("window:hideToTray", () => {
    mainWindow?.hide();
  });
  ipcMain.handle("window:setWidgetMode", (_event, enabled: boolean) => {
    setWidgetMode(enabled);
  });
  ipcMain.handle("window:getDataPath", () => getDataFilePath());
}

export async function persistWindowBounds() {
  if (!mainWindow) {
    return;
  }

  const bounds = mainWindow.getBounds();
  await updateSettings({
    windowBounds: {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height
    }
  });
}

export function applySettings(settings: AppSettings) {
  mainWindow?.setAlwaysOnTop(settings.alwaysOnTop);
  mainWindow?.setOpacity(settings.opacity);
  app.setLoginItemSettings({
    openAtLogin: settings.startAtLogin,
    path: process.execPath
  });
}

export function setWidgetMode(enabled: boolean) {
  if (!mainWindow || isWidgetMode === enabled) {
    return;
  }

  isWidgetMode = enabled;

  if (enabled) {
    mainWindow.setMinimumSize(320, 420);
    mainWindow.setSize(360, 560);
    return;
  }

  mainWindow.setMinimumSize(640, 520);
  mainWindow.setSize(1100, 720);
}

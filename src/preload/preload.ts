import { contextBridge, ipcRenderer } from "electron";
import type { AppData, AppSettings, Category, Task } from "../shared/types";

contextBridge.exposeInMainWorld("rememberTasks", {
  platform: process.platform,
  loadData: (): Promise<AppData> => ipcRenderer.invoke("data:load"),
  saveData: (data: AppData): Promise<AppData> => ipcRenderer.invoke("data:save", data),
  upsertTask: (task: Task): Promise<AppData> => ipcRenderer.invoke("task:upsert", task),
  deleteTask: (taskId: string): Promise<AppData> => ipcRenderer.invoke("task:delete", taskId),
  saveCategories: (categories: Category[]): Promise<AppData> =>
    ipcRenderer.invoke("categories:save", categories),
  updateSettings: (patch: Partial<AppSettings>): Promise<AppData> =>
    ipcRenderer.invoke("settings:update", patch),
  hideToTray: (): Promise<void> => ipcRenderer.invoke("window:hideToTray"),
  setWidgetMode: (enabled: boolean): Promise<void> => ipcRenderer.invoke("window:setWidgetMode", enabled),
  getDataPath: (): Promise<string> => ipcRenderer.invoke("window:getDataPath")
});

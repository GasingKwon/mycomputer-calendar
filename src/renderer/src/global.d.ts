import type { AppData, AppSettings, Category, Task } from "../../shared/types";

declare global {
  interface Window {
    rememberTasks: {
      platform: NodeJS.Platform;
      loadData: () => Promise<AppData>;
      saveData: (data: AppData) => Promise<AppData>;
      upsertTask: (task: Task) => Promise<AppData>;
      deleteTask: (taskId: string) => Promise<AppData>;
      saveCategories: (categories: Category[]) => Promise<AppData>;
      updateSettings: (patch: Partial<AppSettings>) => Promise<AppData>;
      hideToTray: () => Promise<void>;
      getDataPath: () => Promise<string>;
    };
  }
}

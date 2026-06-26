import { app, BrowserWindow } from "electron";
import { createMainWindow, getMainWindow, markQuitting, registerIpcHandlers } from "./window";
import { getAppData } from "./storage";
import { startNotificationScheduler } from "./notifications";
import { setupAutoUpdater } from "./auto-updater";

app.setAppUserModelId("remember-tasks-calendar");

app.whenReady().then(() => {
  registerIpcHandlers();
  void createMainWindow();
  startNotificationScheduler(getAppData);
  setupAutoUpdater();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow();
    } else {
      getMainWindow()?.show();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  markQuitting();
});

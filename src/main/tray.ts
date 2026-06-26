import { app, BrowserWindow, Menu, Tray } from "electron";
import { APP_NAME } from "../shared/constants";
import { getAppIconImage } from "./app-icon";

let tray: Tray | null = null;

export function setupTray(getWindow: () => BrowserWindow | null) {
  if (tray) {
    return tray;
  }

  tray = new Tray(getAppIconImage());
  tray.setToolTip(APP_NAME);
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "열기",
        click: () => showWindow(getWindow())
      },
      {
        label: "종료",
        click: () => app.quit()
      }
    ])
  );

  tray.on("click", () => showWindow(getWindow()));

  return tray;
}

export function showWindow(window: BrowserWindow | null) {
  if (!window) {
    return;
  }

  window.show();
  window.focus();
}

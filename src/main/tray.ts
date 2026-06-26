import { Menu, Tray, BrowserWindow, nativeImage, app } from "electron";

let tray: Tray | null = null;

export function setupTray(getWindow: () => BrowserWindow | null) {
  if (tray) {
    return tray;
  }

  const image = nativeImage.createFromDataURL(
    "data:image/svg+xml;utf8," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" rx="3" fill="#1a73e8"/><path d="M4 5h8M4 8h8M4 11h5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>'
      )
  );
  tray = new Tray(image);
  tray.setToolTip("할 일을 기억해라");
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

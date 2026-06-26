import { app, dialog } from "electron";
import electronUpdater from "electron-updater";

const { autoUpdater } = electronUpdater;

export function setupAutoUpdater() {
  if (!app.isPackaged) {
    return;
  }

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("update-downloaded", async () => {
    const result = await dialog.showMessageBox({
      type: "info",
      buttons: ["지금 재시작", "나중에"],
      defaultId: 0,
      cancelId: 1,
      title: "업데이트 준비 완료",
      message: "새 버전이 다운로드되었습니다.",
      detail: "지금 재시작하면 업데이트가 적용됩니다."
    });

    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.on("error", (error) => {
    console.warn("Auto update failed:", error);
  });

  setTimeout(() => {
    void autoUpdater.checkForUpdatesAndNotify();
  }, 3_000);
}

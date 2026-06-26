import { app, nativeImage } from "electron";
import { existsSync } from "node:fs";
import { join } from "node:path";

export function getAppIconPath() {
  return app.isPackaged ? join(process.resourcesPath, "icon.ico") : join(app.getAppPath(), "build", "icon.ico");
}

export function getAppIconImage() {
  const iconPath = getAppIconPath();

  if (existsSync(iconPath)) {
    const image = nativeImage.createFromPath(iconPath);

    if (!image.isEmpty()) {
      return image;
    }
  }

  return nativeImage.createFromDataURL(
    "data:image/svg+xml;utf8," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" rx="3" fill="#1a73e8"/><path d="M4 5h8M4 8h8M4 11h5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>'
      )
  );
}

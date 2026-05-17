import { ipcMain, type BrowserWindow } from "electron";
import { MayorIntegration } from "./mayor-integration";

export const registerMayorIPC = (window: BrowserWindow) => {
    MayorIntegration.initialize(window);
    const mayorIntegration = MayorIntegration.getInstance();

    // ipc for Mayor
    ipcMain.handle("mayor:attach", () => mayorIntegration.attach());
    ipcMain.handle("mayor:detach", () => mayorIntegration.detach());
    ipcMain.on("mayor:write", (_event, data: string) => mayorIntegration.write(data));
    ipcMain.on("mayor:resize", (_event, cols: number, rows: number) =>
        mayorIntegration.resize(cols, rows)
    );
};

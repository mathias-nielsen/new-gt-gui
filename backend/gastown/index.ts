import { ipcMain, type BrowserWindow } from "electron";
import { GastownIntegration } from "./gastown-integration";
import { GtKillResult, GtRunResult } from "../../shared/gt-api";

export const registerGastownIPC = (window: BrowserWindow) => {
    GastownIntegration.initialize(window);
    const gtIntegration = GastownIntegration.getInstance();

    // ipc for Gastown generals
    ipcMain.handle(
        "gt:run",
        (_event, runId: string, args: string[]): GtRunResult => gtIntegration.run(runId, args)
    );
    ipcMain.handle("gt:kill", (_event, runId: string): GtKillResult => gtIntegration.kill(runId));
    ipcMain.handle("gt:setCwd", (_event, path: string): void => gtIntegration.setCwd(path));
};

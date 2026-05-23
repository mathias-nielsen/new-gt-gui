import { ipcMain, type BrowserWindow } from "electron";
import { GastownIntegration } from "./gastown-integration";
import {
    GtChunkPayload,
    GtExitPayload,
    GtKillResult,
    GtRunResult,
    HandlePayload,
} from "../../shared/gt-api";
import { CHANNELS } from "../../shared/channels";

export const registerGastownIPC = (window: BrowserWindow) => {
    const { GT } = CHANNELS;

    const handleData: HandlePayload<GtChunkPayload> = (payload) => {
        window.webContents.send(GT.STD_OUT, payload);
    };

    const handleError: HandlePayload<GtChunkPayload> = (payload) => {
        window.webContents.send(GT.STD_ERROR, payload);
    };

    const handleExit: HandlePayload<GtExitPayload> = (payload) => {
        window.webContents.send(GT.EXIT, payload);
    };

    GastownIntegration.initialize(handleData, handleError, handleExit);
    const gtIntegration = GastownIntegration.getInstance();

    // ipc for Gastown generals
    ipcMain.handle(
        GT.RUN,
        (_event, runId: string, args: string[]): GtRunResult => gtIntegration.run(runId, args)
    );
    ipcMain.handle(GT.KILL, (_event, runId: string): GtKillResult => gtIntegration.kill(runId));
    ipcMain.handle(GT.SET_CURRENT_WORKING_DIRECTORY, (_event, path: string): void =>
        gtIntegration.setCwd(path)
    );
};

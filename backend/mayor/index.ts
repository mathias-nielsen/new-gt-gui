import { ipcMain, type BrowserWindow } from "electron";
import { MayorIntegration } from "./mayor-integration";
import { CHANNELS } from "../channels";

export type HandleData = (data: string) => void;
export type HandleExit = () => void;

export const registerMayorIPC = (window: BrowserWindow) => {
    const { MAYOR } = CHANNELS;

    MayorIntegration.initialize();
    const mayorIntegration = MayorIntegration.getInstance();

    const handleMayorData: HandleData = (data) => {
        window.webContents.send(MAYOR.DATA, data);
    };
    const handleMayorExit: HandleExit = () => {
        window.webContents.send(MAYOR.DETACH);
    };

    // ipc for Mayor
    ipcMain.handle(MAYOR.ATTACH, () => mayorIntegration.attach(handleMayorData, handleMayorExit));
    ipcMain.handle(MAYOR.DETACH, () => mayorIntegration.detach());
    ipcMain.on(MAYOR.WRITE, (_event, data: string) => mayorIntegration.write(data));
    ipcMain.on(MAYOR.RESIZE, (_event, cols: number, rows: number) =>
        mayorIntegration.resize(cols, rows)
    );
};

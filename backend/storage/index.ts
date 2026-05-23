import { CHANNELS } from "../channels";
import { read, write } from "./storage-integration";
import { ipcMain } from "electron";

export const registerStorageIPC = () => {
    ipcMain.handle(CHANNELS.STORAGE.GET, (_event, key: string) => read()[key] ?? null);
    ipcMain.handle(CHANNELS.STORAGE.SET, (_event, key: string, value: unknown) => {
        write({ ...read(), [key]: value });
    });
};

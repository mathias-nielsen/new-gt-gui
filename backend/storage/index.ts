import { read, write } from "./storage-integration";
import { ipcMain } from "electron";

export const registerStorageIPC = () => {
    ipcMain.handle("storage:get", (_event, key: string) => read()[key] ?? null);
    ipcMain.handle("storage:set", (_event, key: string, value: unknown) => {
        write({ ...read(), [key]: value });
    });
};

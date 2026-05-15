import { app, ipcMain } from "electron";
import fs from "fs";
import path from "path";

const storagePath = () => path.join(app.getPath("userData"), "gastown-storage.json");

const read = (): Record<string, unknown> => {
    try {
        console.log(storagePath());
        return JSON.parse(fs.readFileSync(storagePath(), "utf-8"));
    } catch {
        return {};
    }
};

const write = (data: Record<string, unknown>) => {
    fs.writeFileSync(storagePath(), JSON.stringify(data, null, 2), "utf-8");
};

export const registerStorageIpc = () => {
    ipcMain.handle("storage:get", (_event, key: string) => read()[key] ?? null);
    ipcMain.handle("storage:set", (_event, key: string, value: unknown) => {
        write({ ...read(), [key]: value });
    });
};

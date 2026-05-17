import { app } from "electron";
import fs from "fs";
import path from "path";

const storagePath = () => path.join(app.getPath("userData"), "gastown-storage.json");

export const read = (): Record<string, unknown> => {
    try {
        console.log(storagePath());
        return JSON.parse(fs.readFileSync(storagePath(), "utf-8"));
    } catch {
        return {};
    }
};

export const write = (data: Record<string, unknown>) => {
    fs.writeFileSync(storagePath(), JSON.stringify(data, null, 2), "utf-8");
};

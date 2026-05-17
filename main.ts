import { app, BrowserWindow } from "electron";
import path from "path";
import { registerStorageIPC } from "./backend/storage";
import { registerGastownIPC } from "./backend/gastown";
import { registerMayorIPC } from "./backend/mayor";

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, "backend", "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    if (VITE_DEV_SERVER_URL) {
        window.loadURL(VITE_DEV_SERVER_URL);
        window.webContents.openDevTools({ mode: "right" });
    } else {
        window.loadFile(path.join(__dirname, "..", "dist", "index.html"));
    }

    registerGastownIPC(window);
    registerMayorIPC(window);
    registerStorageIPC();
};

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

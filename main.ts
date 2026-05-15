import { app, BrowserWindow } from "electron";
import path from "path";
import { GastownIntegration } from "./backend/gastown-integration";
import { MayorIntegration } from "./backend/mayor-integration";
import { registerStorageIpc } from "./backend/storage-integration";

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

const createGastownIntegration = (window: BrowserWindow) => {
    GastownIntegration.getInstance().registerIpc(window);
    MayorIntegration.getInstance().registerIpc(window);
};

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

    createGastownIntegration(window);
};

app.whenReady().then(() => {
    registerStorageIpc();
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
